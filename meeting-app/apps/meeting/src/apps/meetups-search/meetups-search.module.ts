import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeetupsSearchService } from './meetups-search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [MeetupsSearchService],
  exports: [MeetupsSearchService],
})
export class MeetupsSearchModule implements OnModuleInit {
  constructor(private readonly searchService: MeetupsSearchService) { }
  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}