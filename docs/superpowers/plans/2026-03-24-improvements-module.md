# Improvements Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Chores feature with an Improvements board where users can submit feature requests and bug reports with a Kanban status flow (Aberta → Em andamento → Concluída).

**Architecture:** New `improvement` NestJS module with a single `Improvement` entity. The `chore` module and all its files are deleted. Frontend `ChoresPage.tsx` is replaced by `ImprovementsPage.tsx` with a fully static interface (no API calls yet). Routes and sidebar are updated accordingly.

**Tech Stack:** NestJS, TypeORM (PostgreSQL, synchronize:true), React, Tailwind CSS, TypeScript.

---

### Task 1: Delete the chore module from backend

**Files:**
- Delete: `backend/src/modules/chore/` (entire directory)
- Modify: `backend/src/app.module.ts` — remove ChoreModule import and reference
- Modify: `backend/src/common/enums/index.ts` — remove `ChoreFrequency` enum

- [ ] **Step 1: Remove chore directory**

```bash
rm -rf backend/src/modules/chore
```

- [ ] **Step 2: Remove ChoreModule from app.module.ts**

Remove lines:
```ts
import { ChoreModule } from './modules/chore/chore.module';
// and inside @Module imports array:
ChoreModule,
```

- [ ] **Step 3: Remove ChoreFrequency enum from common/enums/index.ts**

Remove:
```ts
export enum ChoreFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}
```

- [ ] **Step 4: Verify backend compiles**

```bash
cd backend && npm run build 2>&1 | tail -20
```
Expected: no errors related to chore.

---

### Task 2: Add enums and create the Improvement entity

**Files:**
- Modify: `backend/src/common/enums/index.ts` — add `ImprovementType` and `ImprovementStatus`
- Create: `backend/src/modules/improvement/entities/improvement.entity.ts`

- [ ] **Step 1: Add enums**

In `backend/src/common/enums/index.ts`, append:
```ts
export enum ImprovementType {
  FEATURE = 'FEATURE',
  BUG = 'BUG',
}

export enum ImprovementStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
```

- [ ] **Step 2: Create entity file**

`backend/src/modules/improvement/entities/improvement.entity.ts`:
```ts
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { ImprovementType, ImprovementStatus } from '../../../common/enums';

@Entity('improvements')
@Index(['createdById'])
@Index(['status'])
export class Improvement extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ImprovementType })
  type: ImprovementType;

  @Column({
    type: 'enum',
    enum: ImprovementStatus,
    default: ImprovementStatus.OPEN,
  })
  status: ImprovementStatus;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;
}
```

---

### Task 3: Create DTOs

**Files:**
- Create: `backend/src/modules/improvement/dto/create-improvement.dto.ts`
- Create: `backend/src/modules/improvement/dto/update-improvement.dto.ts`

- [ ] **Step 1: create-improvement.dto.ts**

```ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ImprovementType } from '../../../common/enums';

export class CreateImprovementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(ImprovementType)
  type: ImprovementType;
}
```

- [ ] **Step 2: update-improvement.dto.ts**

```ts
import { IsEnum, IsOptional } from 'class-validator';
import { ImprovementStatus } from '../../../common/enums';

export class UpdateImprovementDto {
  @IsEnum(ImprovementStatus)
  @IsOptional()
  status?: ImprovementStatus;
}
```

---

### Task 4: Create service

**Files:**
- Create: `backend/src/modules/improvement/improvement.service.ts`

- [ ] **Step 1: Write service**

```ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Improvement } from './entities/improvement.entity';
import { CreateImprovementDto } from './dto/create-improvement.dto';
import { UpdateImprovementDto } from './dto/update-improvement.dto';
import { UserRole } from '../../common/enums';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ImprovementService {
  constructor(
    @InjectRepository(Improvement)
    private readonly repo: Repository<Improvement>,
  ) {}

  findAll(): Promise<Improvement[]> {
    return this.repo.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  create(userId: string, dto: CreateImprovementDto): Promise<Improvement> {
    const improvement = this.repo.create({
      title: dto.title,
      description: dto.description ?? null,
      type: dto.type,
      createdById: userId,
    });
    return this.repo.save(improvement);
  }

  async updateStatus(
    id: string,
    dto: UpdateImprovementDto,
    currentUser: { id: string; role: UserRole },
  ): Promise<Improvement> {
    const improvement = await this.repo.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!improvement) throw new NotFoundException('Improvement not found');

    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isOwner = improvement.createdById === currentUser.id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Only the creator or an admin can update status');
    }

    if (dto.status !== undefined) improvement.status = dto.status;
    return this.repo.save(improvement);
  }

  async remove(id: string, currentUser: { id: string; role: UserRole }): Promise<void> {
    const improvement = await this.repo.findOne({ where: { id } });
    if (!improvement) throw new NotFoundException('Improvement not found');

    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isOwner = improvement.createdById === currentUser.id;
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Only the creator or an admin can delete');
    }

    await this.repo.remove(improvement);
  }
}
```

---

### Task 5: Create controller and module

**Files:**
- Create: `backend/src/modules/improvement/improvement.controller.ts`
- Create: `backend/src/modules/improvement/improvement.module.ts`

- [ ] **Step 1: Write controller**

```ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ImprovementService } from './improvement.service';
import { CreateImprovementDto } from './dto/create-improvement.dto';
import { UpdateImprovementDto } from './dto/update-improvement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@Controller('improvements')
@UseGuards(JwtAuthGuard)
export class ImprovementController {
  constructor(private readonly service: ImprovementService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateImprovementDto,
  ) {
    return this.service.create(userId, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateImprovementDto,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.service.updateStatus(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.service.remove(id, user);
  }
}
```

- [ ] **Step 2: Write module**

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Improvement } from './entities/improvement.entity';
import { ImprovementService } from './improvement.service';
import { ImprovementController } from './improvement.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Improvement]), AuthModule],
  controllers: [ImprovementController],
  providers: [ImprovementService],
})
export class ImprovementModule {}
```

---

### Task 6: Register module in AppModule

**Files:**
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Add import and registration**

```ts
import { ImprovementModule } from './modules/improvement/improvement.module';
// inside @Module imports array:
ImprovementModule,
```

- [ ] **Step 2: Verify backend compiles**

```bash
cd backend && npm run build 2>&1 | tail -20
```
Expected: BUILD COMPLETE, no errors.

---

### Task 7: Replace ChoresPage with ImprovementsPage in frontend

**Files:**
- Delete: `frontend/src/pages/ChoresPage.tsx`
- Create: `frontend/src/pages/ImprovementsPage.tsx`
- Modify: `frontend/src/App.tsx` — swap route
- Modify: `frontend/src/components/AppSidebar.tsx` — update nav item

- [ ] **Step 1: Delete ChoresPage.tsx**

```bash
rm frontend/src/pages/ChoresPage.tsx
```

- [ ] **Step 2: Create ImprovementsPage.tsx**

Pure static interface — no API calls. Two types (Feature/Bug), three status columns (Aberta/Em andamento/Concluída), modal to create, cards with type badge + status badge. See full code below.

```tsx
import { useState } from "react";
import AppSidebar from "../components/AppSidebar";

type ImprovementType = "FEATURE" | "BUG";
type ImprovementStatus = "OPEN" | "IN_PROGRESS" | "DONE";

interface Improvement {
  id: number;
  title: string;
  description?: string;
  type: ImprovementType;
  status: ImprovementStatus;
  createdBy: string;
  createdAt: string;
}

const TYPE_CONFIG: Record<ImprovementType, { label: string; color: React.CSSProperties; icon: string }> = {
  FEATURE: {
    label: "Feature",
    color: { background: "rgba(37,99,235,0.15)", color: "#60a5fa" },
    icon: "✨",
  },
  BUG: {
    label: "Bug",
    color: { background: "rgba(220,38,38,0.15)", color: "#f87171" },
    icon: "🐛",
  },
};

const STATUS_CONFIG: Record<ImprovementStatus, { label: string; color: React.CSSProperties }> = {
  OPEN: { label: "Aberta", color: { background: "rgba(100,116,139,0.15)", color: "#94a3b8" } },
  IN_PROGRESS: { label: "Em andamento", color: { background: "rgba(234,179,8,0.15)", color: "#facc15" } },
  DONE: { label: "Concluída", color: { background: "rgba(5,150,105,0.15)", color: "#34d399" } },
};

const STATUSES: ImprovementStatus[] = ["OPEN", "IN_PROGRESS", "DONE"];

const INITIAL: Improvement[] = [
  { id: 1, title: "Modo escuro melhorado", description: "Ajustar contraste nos cards de filme", type: "FEATURE", status: "OPEN", createdBy: "Ana", createdAt: "2026-03-20" },
  { id: 2, title: "Notificações em tempo real", description: "Receber push quando alguém menciona você", type: "FEATURE", status: "IN_PROGRESS", createdBy: "Bernardo", createdAt: "2026-03-18" },
  { id: 3, title: "Bug no login com @", description: "Ao usar @ no usuário o login falha silenciosamente", type: "BUG", status: "OPEN", createdBy: "Carlos", createdAt: "2026-03-22" },
  { id: 4, title: "Paginação na home", description: "Carregar mais posts ao rolar até o fim", type: "FEATURE", status: "DONE", createdBy: "Ana", createdAt: "2026-03-10" },
  { id: 5, title: "Avatar não carrega no Safari", type: "BUG", status: "IN_PROGRESS", createdBy: "Débora", createdAt: "2026-03-21" },
];

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
};

export default function ImprovementsPage() {
  const [items, setItems] = useState<Improvement[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "FEATURE" as ImprovementType });

  function addImprovement() {
    if (!form.title.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: form.title,
        description: form.description || undefined,
        type: form.type,
        status: "OPEN",
        createdBy: "Você",
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setForm({ title: "", description: "", type: "FEATURE" });
    setShowModal(false);
  }

  function moveStatus(id: number, status: ImprovementStatus) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const byStatus = (s: ImprovementStatus) => items.filter((i) => i.status === s);

  return (
    <main className="grid grid-cols-[auto_1fr] h-dvh max-w-6xl mx-auto bg-[#070714] text-slate-100 font-sans">
      <AppSidebar />

      <section className="overflow-y-auto flex flex-col">
        {/* Header */}
        <div
          className="sticky top-0 z-10 backdrop-blur-sm px-6 py-4 flex items-center justify-between"
          style={{ background: "rgba(7,7,20,0.85)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <h1 className="text-xl font-bold text-slate-100">Melhorias</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {items.filter((i) => i.status === "OPEN").length} abertas ·{" "}
              {items.filter((i) => i.status === "IN_PROGRESS").length} em andamento ·{" "}
              {items.filter((i) => i.status === "DONE").length} concluídas
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
            style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M19 11H13V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z" />
            </svg>
            Nova solicitação
          </button>
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-3 gap-4 p-6 flex-1">
          {STATUSES.map((status) => {
            const cfg = STATUS_CONFIG[status];
            const col = byStatus(status);
            return (
              <div key={status} className="flex flex-col gap-3">
                {/* Column header */}
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={cfg.color}>
                    {cfg.label}
                  </span>
                  <span className="text-xs text-slate-600">{col.length}</span>
                </div>

                {/* Cards */}
                {col.length === 0 && (
                  <div className="text-center py-10 text-slate-700 text-xs">Nenhuma aqui</div>
                )}
                {col.map((item) => {
                  const typeCfg = TYPE_CONFIG[item.type];
                  const nextStatuses = STATUSES.filter((s) => s !== item.status);
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl p-4 flex flex-col gap-3 group"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      {/* Type badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={typeCfg.color}>
                          {typeCfg.icon} {typeCfg.label}
                        </span>
                        <button
                          onClick={() => remove(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all hover:bg-red-500/10 text-slate-600 hover:text-red-400"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                            <path d="M6 7h12v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V7zm3 10h2V9H9v8zm4 0h2V9h-2v8zM15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
                          </svg>
                        </button>
                      </div>

                      {/* Title + description */}
                      <div>
                        <p className="text-sm font-semibold text-slate-100 leading-snug">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                        )}
                      </div>

                      {/* Meta */}
                      <p className="text-xs text-slate-600">
                        {item.createdBy} · {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </p>

                      {/* Move actions */}
                      <div className="flex gap-1 flex-wrap">
                        {nextStatuses.map((s) => (
                          <button
                            key={s}
                            onClick={() => moveStatus(item.id, s)}
                            className="text-xs px-2 py-1 rounded-full transition-all hover:opacity-80"
                            style={STATUS_CONFIG[s].color}
                          >
                            → {STATUS_CONFIG[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="absolute inset-0 flex items-center justify-center z-30"
          style={{ background: "rgba(7,7,20,0.8)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
            style={{ background: "rgba(15,10,35,0.98)", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            <h2 className="text-lg font-bold text-slate-100 mb-6">Nova solicitação</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tipo</label>
                <div className="flex gap-2">
                  {(["FEATURE", "BUG"] as ImprovementType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={
                        form.type === t
                          ? { ...TYPE_CONFIG[t].color, border: "1px solid transparent" }
                          : { ...inputStyle, color: "#64748b" }
                      }
                    >
                      {TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Título</label>
                <input
                  type="text"
                  placeholder="Descreva brevemente"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Descrição (opcional)</label>
                <textarea
                  placeholder="Detalhes adicionais..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-85"
                style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)" }}
                onClick={addImprovement}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 3: Update App.tsx**

Replace:
```tsx
import ChoresPage from "./pages/ChoresPage";
// route:
<Route path="/chores"   element={<ChoresPage />} />
```
With:
```tsx
import ImprovementsPage from "./pages/ImprovementsPage";
// route:
<Route path="/improvements" element={<ImprovementsPage />} />
```

- [ ] **Step 4: Update AppSidebar.tsx**

Replace the "Tarefas" nav item:
```ts
{
  label: "Tarefas",
  path: "/chores",
  icon: (...checkmark icon...)
}
```
With:
```ts
{
  label: "Melhorias",
  path: "/improvements",
  icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M19.5 9.5c-1.03 0-1.9.62-2.29 1.5h-2.92c-.39-.88-1.26-1.5-2.29-1.5s-1.9.62-2.29 1.5H7.29C6.9 10.12 6.03 9.5 5 9.5 3.62 9.5 2.5 10.62 2.5 12s1.12 2.5 2.5 2.5c1.03 0 1.9-.62 2.29-1.5h2.42c.39.88 1.26 1.5 2.29 1.5s1.9-.62 2.29-1.5h2.42c.39.88 1.26 1.5 2.29 1.5 1.38 0 2.5-1.12 2.5-2.5S20.88 9.5 19.5 9.5zM12 3L4 9h2v9h4v-5h4v5h4V9h2L12 3z" />
    </svg>
  ),
}
```

---

### Task 8: Final verification

- [ ] **Step 1: Verify backend still compiles**
```bash
cd backend && npm run build 2>&1 | tail -5
```

- [ ] **Step 2: Verify no remaining chore references**
```bash
grep -r "chore\|Chore\|ChoreModule" backend/src --include="*.ts" | grep -v ".js"
grep -r "ChoresPage\|/chores" frontend/src
```
Expected: no results.
