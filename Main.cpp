#include "DebilCounter.h"

#include <Sql/sch_schema.h>
#include <Sql/sch_source.h>

Value LocalTime(const Vector<Value>& arg, const Renderer *) {
	Time t = arg[0];
	if (IsNull(t))
		return "";
	RawHtmlText r;
	r.text.Cat("<script type=\"text/javascript\">printDate(");
	RDUMP(t);
	RDUMP(GetUTCSeconds(t));
	RDUMP(AsString(GetUTCSeconds(t)*1000));
	r.text.Cat(AsString(GetUTCSeconds(t)*1000));
	
	r.text.Cat(");</script>");
	return RawPickToValue(r);
}

Value Duration(const Vector<Value>& arg, const Renderer *)
{
	int t = GetSysTime() - Time(arg[0]);
	if (t<=0)
		return "";
	else if (t<60)
		return Format("%d`s", t);
	else if (t<3600)
		return Format("%d`m %d`s", t/60, t%60);
	else if (t<86400)
		return Format("%d`h %d`m %d`s", t/3600, (t%3600)/60, (t%3600)%60);
	else
		return Format("%d`d %d`h %d`m %d`s", t/86400, (t%86400)/3600, ((t%86400)%3600)/60, ((t%86400)%3600)%60);
}

INITBLOCK {
	Compiler::Register("time", LocalTime);
	Compiler::Register("duration", Duration);
};


DebilCounter::DebilCounter() {
	root = "";
#ifdef _DEBUG
	prefork = 0;
	use_caching = false;
#endif
	threads = 1; // Sqlite3 does not work well with multiple threads
	port = StrInt(CommandLine()[0]);
	if (IsNull(port)) port = 80;
	session.table = SESSION;
	session.id_column = SID;
	session.lastwrite_column = STIME;
	session.data_column = SDATA;
	session.format = SESSION_FORMAT_JSON;
}

void OpenSQL(Sqlite3Session& session) {
	if(!session.Open(ConfigFile("db.sqlite3"))) {
		SKYLARKLOG("Can't create or open database file");
		Exit(1);
	}
#ifdef _DEBUG
	session.LogErrors();
	session.SetTrace();
#endif
	SQL = session;
}

void InitModel() {
#ifdef _DEBUG
	Sqlite3Session session;
	OpenSQL(session);
	SqlSchema sch(SQLITE3);
	All_Tables(sch);
	SqlPerformScript(sch.Upgrade());
	SqlPerformScript(sch.Attributes());
	sch.SaveNormal();
#endif
}

void DebilCounter::WorkThread() {
	Sqlite3Session session;
	OpenSQL(session);
	RunThread();
}

// Local server URL: 127.0.0.1:8001/DebilCounter
CONSOLE_APP_MAIN {
#ifdef _DEBUG
	StdLogSetup(LOG_FILE|LOG_COUT);
	Ini::skylark_log = true;
#endif
	InitModel();
	DebilCounter().Run();
}
