import { envs } from '../../config/envs';
import { QuestionDto } from '../../domain/interfaces/assistant.interface';
import { OpenAIService } from './openai.service';

export class AssistantService {
  constructor(private readonly openAiService: OpenAIService) {}

  createThread() {
    return this.openAiService.createThread();
  }

  async useQuestion(questionDto: QuestionDto) {
    const { threadId, question } = questionDto;

    await this.openAiService.createMessage(threadId, question);

    const run = await this.openAiService.createRun(threadId, envs.OPENAI_ASSISTANT_ID);

    await this.openAiService.checkCompleteStatus(threadId, run.id);

    const messages = await this.openAiService.getMessageList(threadId);

    return messages;
  }
}
