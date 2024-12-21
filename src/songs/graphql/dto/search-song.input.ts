import { InputType, Field } from '@nestjs/graphql';
import { PaginationInput } from './song-filter.input';

@InputType()
export class SearchSongsInput {
    @Field()
    query: string;

    @Field(() => PaginationInput, { nullable: true })
    pagination?: PaginationInput;
}