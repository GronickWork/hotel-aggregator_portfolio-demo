import { Test, TestingModule } from '@nestjs/testing';
import { HandlerFilesService } from './handler-files.service';

describe('HandlerFilesService', () => {
  let service: HandlerFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandlerFilesService],
    }).compile();

    service = module.get<HandlerFilesService>(HandlerFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
