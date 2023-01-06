import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const option: SchemaOptions = { timestamps: true, collection: 'users' };

@Schema(option)
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Prop()
  @IsString()
  country: string;

  @Prop()
  @IsString()
  birth: string;

  @Prop({
    default:
      'https://concierge-korea.s3.amazonaws.com/base/defaultProfile.webp',
  })
  @IsString()
  profileImg: string;

  readonly readOnlyData: {
    id: string;
    email: string;
    nickname: string;
    country: string;
    birth: string;
    profileImg: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    id: this._id,
    email: this.email,
    nickname: this.nickname,
    country: this.country,
    birth: this.birth,
    profileImg: this.profileImg,
  };
});
