import{s as a}from"./index-Jg4goi_v.js";async function i(t){await t.schema.createTable("note").ifNotExists().addColumn("id","integer",e=>e.primaryKey().autoIncrement()).addColumn("summary","varchar",e=>e.notNull()).addColumn("parentId","integer").addColumn("isOpened","boolean",e=>e.notNull().defaultTo(!0)).addColumn("dateCreated","timetz",e=>e.defaultTo(a`(datetime(CURRENT_TIMESTAMP, 'localtime'))`).notNull()).execute(),await a`
    CREATE TRIGGER IF NOT EXISTS remove_children_of_deleted_note
    AFTER DELETE ON note
    FOR EACH ROW
    BEGIN 
      DELETE FROM note
      WHERE note.parentId = OLD.id;
    END;
  `.execute(t),await a`
    CREATE TRIGGER IF NOT EXISTS remove_descsquare_of_deleted_note
    AFTER DELETE ON note
    FOR EACH ROW
    BEGIN 
      DELETE FROM descSquare
      WHERE descSquare.noteId = OLD.id;
    END;
  `.execute(t),await t.schema.createTable("link").ifNotExists().addColumn("id","integer",e=>e.primaryKey().autoIncrement()).addColumn("note1Id","integer",e=>e.notNull()).addColumn("note2Id","integer",e=>e.notNull()).addCheckConstraint("check_first_id_less",a`note1Id < note2Id`).execute(),await t.schema.createIndex("link_index").ifNotExists().unique().on("link").columns(["note1Id","note2Id"]).execute(),await t.schema.createTable("timetrack").ifNotExists().addColumn("id","integer",e=>e.primaryKey().autoIncrement()).addColumn("name","varchar").addColumn("timeStart","timetz").addColumn("timeStop","timetz").execute(),await t.schema.createTable("timetrackTask").ifNotExists().addColumn("id","integer",e=>e.primaryKey().autoIncrement()).addColumn("summary","varchar",e=>e.notNull()).addColumn("timetrackId","integer",e=>e.notNull()).addColumn("dateCreated","timetz",e=>e.defaultTo(a`(datetime(CURRENT_TIMESTAMP, 'localtime'))`).notNull()).addForeignKeyConstraint("timetrack_task",["timetrackId"],"timetrack",["id"],e=>e.onDelete("cascade")).execute(),await t.schema.createTable("timetrackApproach").ifNotExists().addColumn("id","integer",e=>e.primaryKey().autoIncrement()).addColumn("timetrackId","integer",e=>e.notNull()).addColumn("timetrackTaskId","integer").addColumn("timeStart","timetz",e=>e.defaultTo(a`(datetime(CURRENT_TIMESTAMP, 'localtime'))`).notNull()).addColumn("timeStop","timetz").addColumn("timeElapsed","integer",e=>e.defaultTo(0)).addForeignKeyConstraint("timetrack_approach",["timetrackTaskId"],"timetrackTask",["id"],e=>e.onDelete("cascade")).execute(),await a`
    CREATE TRIGGER IF NOT EXISTS timetrack_task_elapsed_time
    AFTER UPDATE OF timeStop ON timetrackApproach
    FOR EACH ROW WHEN NEW.timeStop IS NOT NULL
    BEGIN 
      UPDATE timetrackApproach SET timeElapsed=(julianday(NEW.timeStop) - julianday(NEW.timeStart)) * 86400.0
      WHERE id=OLD.id;
    END;
  `.execute(t),await t.schema.createTable("history").ifNotExists().addColumn("id","integer",e=>e.primaryKey().autoIncrement()).addColumn("type","integer").addColumn("comment","text").addColumn("dateCreated","timetz",e=>e.defaultTo(a`(datetime(CURRENT_TIMESTAMP, 'localtime'))`).notNull()).execute(),await t.schema.createTable("historyNote").ifNotExists().addColumn("id","integer",e=>e.primaryKey().autoIncrement()).addColumn("noteId","integer").addColumn("historyId","integer").execute(),await t.schema.createTable("descSquare").ifNotExists().addColumn("id","integer",e=>e.primaryKey().autoIncrement()).addColumn("noteId","integer").addColumn("summary","text").addColumn("quad","integer").addColumn("dateCreated","timetz",e=>e.defaultTo(a`(datetime(CURRENT_TIMESTAMP, 'localtime'))`).notNull()).execute(),await t.schema.createTable("eisenhowerMatrix").ifNotExists().addColumn("id","integer",e=>e.primaryKey()).addColumn("quad","integer").execute(),await t.schema.createTable("alarm").ifNotExists().addColumn("id","integer",e=>e.primaryKey()).addColumn("noteId","integer").addColumn("date","timetz").execute()}async function d(t){}const n=Object.freeze(Object.defineProperty({__proto__:null,down:d,up:i},Symbol.toStringTag,{value:"Module"})),m={1:n};export{m as migrations};
