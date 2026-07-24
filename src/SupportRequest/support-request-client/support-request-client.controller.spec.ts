/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
//import { SupportRequestClientController } from './support-request-client.controller';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestSchema } from '../schemas/supportRequest.schema';
import { Message } from '../schemas/message.schema';
import { AppModule } from '../../app.module';
import { SupportRequestModule } from '../support-request/support-request.module';
import mongoose from 'mongoose';
import { CreateSupportRequestDto } from '../Interfaces/dto/CreateSupportRequestDto';
import { typeId } from 'src/Users/Interfaces/param-id';
import request from 'supertest';

describe('SupportRequestClientController', () => {
  //let controller: SupportRequestClientController;
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: SupportRequest.name, schema: SupportRequestSchema },
          { name: Message.name, schema: Message },
        ]),
        AppModule,
        SupportRequestModule,
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });

  /*beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportRequestClientController],
    }).compile();

    controller = module.get<SupportRequestClientController>(
      SupportRequestClientController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });*/
  it('api/client/support-requests/ (POST)', async () => {
    const req = {
      session: { userId: 123 as typeId },
    };
    const newBody: CreateSupportRequestDto = {
      user: req.session.userId,
      text: 'Testin request',
    };
    return await request(app.getHttpServer())
      .post('api/client/support-requests/')
      .send(newBody)
      .expect(201)
      .then((resp) => expect(resp.body).toHaveProperty('__id'));
  });
});
