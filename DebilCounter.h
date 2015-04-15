#ifndef _DebilCounter_DebilCounter_h
#define _DebilCounter_DebilCounter_h

#include <Skylark/Skylark.h>
#include <plugin/sqlite3/Sqlite3.h>

using namespace Upp;

#define  MODEL         <DebilCounter/Model.sch>
#define  SCHEMADIALECT <plugin/sqlite3/Sqlite3Schema.h>
#include <Sql/sch_header.h>

Value Render(const Vector<Value>& arg, const Renderer *r);

class DebilCounter : public SkylarkApp {
public:
	virtual void WorkThread();

	typedef DebilCounter CLASSNAME;
	DebilCounter();
};

#endif
