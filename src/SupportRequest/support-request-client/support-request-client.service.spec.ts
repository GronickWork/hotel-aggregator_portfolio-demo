import { Test, TestingModule } from '@nestjs/testing';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestClientController } from './support-request-client.controller';

describe('SupportRequestClientService', () => {
  let service: SupportRequestClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportRequestClientController],
      providers: [SupportRequestClientService],
    }).compile();

    service = module.get<SupportRequestClientService>(SupportRequestClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
