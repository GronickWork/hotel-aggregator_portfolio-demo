import { Test, TestingModule } from '@nestjs/testing';
import { SupportRequestService } from './support-request.service';
import { SupportRequestController } from './support-request.controller';

describe('SupportRequestService', () => {
  let service: SupportRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportRequestController],
      providers: [SupportRequestService],
    }).compile();

    service = module.get<SupportRequestService>(SupportRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
