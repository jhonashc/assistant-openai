import OpenAI from 'openai';

import { envs } from '../../config/envs';

export class OpenAIService {
  private readonly openAi: OpenAI;

  constructor() {
    this.openAi = new OpenAI({
      apiKey: envs.OPENAI_KEY,
    });
  }

  getReverseWord(word: string): string {
    return word.split('').reverse().join('');
  }

  isPolindrome(word: string): boolean {
    return word === word.split('').reverse().join('');
  }

  getToolOuput(functionName: string, functionArgs: any) {
    console.log({ functionName, functionArgs });

    switch (functionName) {
      case 'get_reverse_word':
        return this.getReverseWord(functionArgs.word);

      case 'is_polindrome':
        return this.isPolindrome(functionArgs.word);

      default:
        return { error: 'unknown function', message: 'function not found' };
    }
  }

  createThread(): Promise<OpenAI.Beta.Threads.Thread> {
    return this.openAi.beta.threads.create();
  }

  createMessage(threadId: string, question: string): Promise<OpenAI.Beta.Threads.Messages.Message> {
    return this.openAi.beta.threads.messages.create(threadId, {
      role: 'user',
      content: question,
    });
  }

  createRun(threadId: string, assistantId: string): Promise<OpenAI.Beta.Threads.Runs.Run> {
    return this.openAi.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
  }

  async checkCompleteStatus(threadId: string, runId: string): Promise<OpenAI.Beta.Threads.Runs.Run> {
    const runStatus: OpenAI.Beta.Threads.Runs.Run = await this.openAi.beta.threads.runs.retrieve(threadId, runId);

    if (runStatus.status === 'completed') {
      return runStatus;
    }

    // TODO: handle requires_action
    if (runStatus.status === 'requires_action') {
      const requiredActions: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[] =
        runStatus.required_action?.submit_tool_outputs.tool_calls ?? [];

      const toolsOutput: OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[] = [];

      for (const action of requiredActions) {
        const functionName: string = action.function.name;
        const functionArgs: any = JSON.parse(action.function.arguments);

        const toolOutput = this.getToolOuput(functionName, functionArgs);

        toolsOutput.push({
          tool_call_id: action.id,
          output: JSON.stringify(toolOutput),
        });
      }

      // Submit the tool outputs to Assistant API
      await this.openAi.beta.threads.runs.submitToolOutputs(threadId, runId, {
        tool_outputs: toolsOutput,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return await this.checkCompleteStatus(threadId, runId);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return await this.checkCompleteStatus(threadId, runId);
  }

  async getMessageList(threadId: string) {
    const messageList: OpenAI.Beta.Threads.Messages.MessagesPage = await this.openAi.beta.threads.messages.list(
      threadId,
    );

    const messages = messageList.data.map((message) => ({
      role: message.role,
      // content: message.content.map((content) => (content as any).text.value),
      content: (message.content[0] as any).text.value,
    }));

    return messages.reverse();
  }
}
