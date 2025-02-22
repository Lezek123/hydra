// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  BaseModel,
  Model,
  StringField,
  JSONField,
  IntField,
  WarthogField,
} from '@joystream/warthog'
import BN from 'bn.js'
import { ObjectType, Field } from 'type-graphql'
import { Column, OneToOne, JoinColumn } from 'typeorm'
import { GraphQLJSON } from 'graphql-type-json'

import { NumericTransformer } from '@joystream/bn-typeorm'
import { AnyJson, AnyJsonField } from '@joystream/hydra-common'

import { SubstrateExtrinsic } from '../substrate-extrinsic/substrate-extrinsic.model'
import GraphQLBigNumber from '../../types/bn-graphql'

@ObjectType()
export class EventParam {
  @Field()
  type!: string

  @Field()
  name?: string

  @Field(() => GraphQLJSON, { nullable: true })
  value?: AnyJsonField
}

@Model({ db: { name: 'substrate_event' } })
export class SubstrateEvent extends BaseModel {
  @StringField()
  name!: string

  @StringField({
    nullable: true,
  })
  section?: string

  @StringField({
    nullable: true,
  })
  extrinsicName?: string

  @StringField()
  method!: string

  @JSONField()
  phase!: AnyJson

  @JSONField()
  data!: AnyJson

  @JSONField()
  extrinsicArgs!: AnyJson

  @StringField({ nullable: true })
  extrinsicHash?: string

  @IntField()
  blockNumber!: number

  @IntField()
  indexInBlock!: number

  @Field(() => [EventParam], { nullable: true })
  @Column('jsonb')
  @WarthogField('json', { nullable: true })
  params?: EventParam[]

  @OneToOne(() => SubstrateExtrinsic, (e: SubstrateExtrinsic) => e.event, {
    cascade: true,
    nullable: true,
  })
  @Field(() => SubstrateExtrinsic, { nullable: true })
  @JoinColumn()
  extrinsic?: SubstrateExtrinsic

  @Field(() => GraphQLBigNumber)
  @WarthogField('numeric')
  @Column({ type: 'numeric', transformer: new NumericTransformer() })
  blockTimestamp!: BN
}
