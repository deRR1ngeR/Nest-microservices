import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MeetupSearch } from 'libs/common/contracts/meetups/meetups.search';


@Injectable()
export class MeetupsSearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) { }

  async createIndex() {
    const indexName = this.configService.get('ELASTICSEARCH_INDEX');

    // Define the custom analyzer
    const analyzerConfig = {
      analysis: {
        analyzer: {
          case_insensitive_analyzer: {
            type: 'custom',
            tokenizer: 'keyword',
            filter: ['lowercase'],
          },
        },
      },
    };

    // Define the index mapping
    const indexConfig = {
      index: indexName,
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
        // Include the custom analyzer configuration
        settings: analyzerConfig,
      },
    };

    // Check if the index exists
    const indexExists = await this.esService.indices.exists({
      index: indexName,
    });

    console.log(`Index exists: ${indexExists}`);

    if (!indexExists) {
      // Create the index with the specified mapping
      await this.esService.indices.create(indexConfig);
    }
  }
  async indexMeetup(meetup: any) {
    return await this.esService
      .index({
        index: this.configService.get('ELASTICSEARCH_INDEX'),
        body: meetup,
      })
      .then(
        function (resp) {
          console.log('SUCCESS_UPLOAD', resp);
        },
        function (err) {
          console.trace(err.message);
        },
      );
  }

  async updateIndexMeetup(meetup: MeetupSearch.Response) {
    const body = await this.esService.search({
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
      console.log('DOCUMENT_NOT_FOUND');
    }
  }

  async search(text: string) {
    const body = await this.esService.search<any>({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'description'],
          },
        },
      },
    });

    const hits = body.hits.hits;
    return hits.map((hit: any) => hit._source);
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