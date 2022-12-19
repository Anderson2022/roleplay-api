import Hash from "@ioc:Adonis/Core/Hash";
import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  beforeSave,
  hasMany,
  HasMany,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import LinkToken from "./LinkToken";
import Group from "./Group";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  @column()
  public username: string;

  @column()
  public email: string;

  @column()
  public password: string;

  @column()
  public avatar: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => LinkToken, {
    foreignKey: "userId",
  })
  public tokens: HasMany<typeof LinkToken>;

  @manyToMany(() => Group, {
    pivotTable: 'groups_users',
  } )

  public groups: ManyToMany<typeof Group>


  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password);
  }
}
