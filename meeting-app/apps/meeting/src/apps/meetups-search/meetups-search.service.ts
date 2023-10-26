import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MeetupsSearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) { }

  async createIndex() {
    const checkIndex = await this.esService.indices.exists({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
    });

    if (!checkIndex) {
      this.esService.indices
        .create({
          index: this.configService.get('ELASTICSEARCH_INDEX'),
          body: {
            mappings: {
              properties: {
                id: { type: 'integer' },
                name: { type: 'text' },
                description: {
                  type: 'text',
                  analyzer: 'case_insensitive_analyzer',
                },
                tags: { type: 'text' },
                date: { type: 'date' },
                longitude: { type: 'float' },
                latitude: { type: 'float' },
                creatorId: { type: 'integer' }
              },
            },
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  async indexMeetup(meetup: any) {
    return await this.esService.index({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: meetup,
    });
  }

  async search(text: string) {
    console.log(text);
    const { body } = await this.esService.search<any>({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['name', 'description'],
          },
        },
      },
    });

    console.log(body.hits);

    const hits = body.hits.hits;
    return hits.map((hit: any) => hit._source);
  }

  async updateIndex(meetup: any) {
    const { body } = await this.esService.search({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: {
          match: { id: meetup.id },
        },
      },
    });

    if (body.hits.hits.length > 0) {
      const docId = body.hits.hits[0]._id;

      return await this.esService.update({
        index: this.configService.get('ELASTICSEARCH_INDEX'),
        id: docId,
        body: {
          doc: meetup,
        },
      });
    } else {
      console.log('Документ не найден.');
    }
  }

  async removeIndex(meetupId: number) {
    this.esService.deleteByQuery({
      index: this.configService.get('ELASTICSEARCH_INDEX')!,
      body: {
        query: {
          match: {
            id: meetupId,
          },
        },
      },
    });
  }
}