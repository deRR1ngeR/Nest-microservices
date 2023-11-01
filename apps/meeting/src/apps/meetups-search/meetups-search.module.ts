import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeetupsSearchService } from './meetups-search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const node = configService.get('ELASTICSEARCH_NODE');
        const username = configService.get('ELASTICSEARCH_USERNAME');
        const password = configService.get('ELASTICSEARCH_PASSWORD');

        return {
          node,
          auth: {
            username,
            password,
          },
        };
      },
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
    try {
      await this.searchService.createIndex();
    } catch (error) {
      console.log(error);
    }
  }
}