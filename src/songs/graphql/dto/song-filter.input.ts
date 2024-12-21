import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class MonthFilterInput {
    @Field()
    month: string;
}

@InputType()
export class PaginationInput {
    @Field(() => Int, { defaultValue: 10 })
    limit: number;

    @Field(() => Int, { defaultValue: 0 })
    offset: number;
}