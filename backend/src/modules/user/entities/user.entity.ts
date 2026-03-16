import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { UserRole } from "../../../common/enums";

@Entity("users")
export class User extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 15, unique: true })
  username: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, select: false, nullable: true })
  password: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  bio: string | null;

  @Column({
    name: "avatar_url",
    type: "varchar",
    length: 1000,
    nullable: true,
    default: null,
  })
  avatarUrl: string | null;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: "last_login_at", nullable: true })
  lastLoginAt: Date;
}
