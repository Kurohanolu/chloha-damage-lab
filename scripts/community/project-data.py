"""Project the immutable registry into the calculator's own minimal runtime schema.

No numerical value, entity name, mechanic, support flag or saved identifier changes.
Article/source audit metadata and unused explanatory fields are not redistributed.
"""
import json
import re

POKEMON = ['id', 'name', 'types', 'baseStats', 'abilities', 'verificationStatus']
MOVES = ['id', 'name', 'type', 'power', 'category', 'target', 'calculationSupported', 'verificationStatus', 'accuracy']

def transform(html):
    summaries = {}
    def read(name):
        return json.loads(re.search(r'const '+name+r' = (.*);', html)[1])
    replacements = {}
    for name, collection, fields in [('ChlohaPokemonDB','pokemon',POKEMON),('ChlohaMovesDB','moves',MOVES)]:
        source=read(name)
        rows=[]
        for record in source[collection]:
            row={k:record[k] for k in fields if k in record}
            assert isinstance(row['id'],str) and isinstance(row['name'],str)
            assert len(row['name'])<=40
            if collection=='pokemon':
                assert len(row['baseStats'])==6 and all(type(v)==int for v in row['baseStats'].values())
                assert all(isinstance(a,str) and len(a)<=24 for a in row['abilities'])
            else:
                assert type(row['power'])==int and row['category'] in ['physical','special','status']
            rows.append(row)
        # Sort by the project's persistent identifier, not an external editorial order.
        rows.sort(key=lambda row:row['id'])
        replacements[name]={'schemaVersion':'community-runtime-1','status':'frozen-v100-runtime',collection:rows}
        summaries[name]={'records':len(rows),'retainedFields':fields,'removedFields':sorted(set(k for row in source[collection] for k in row)-set(fields)),'allRetainedValuesUnchanged':True,'order':'project-id'}
    original=read('ChlohaLearnsetsDB')
    replacements['ChlohaLearnsetsDB']={'schemaVersion':'community-runtime-1','status':'candidate-only','candidateMoves':original['candidateMoves']}
    summaries['ChlohaLearnsetsDB']={'retainedFields':['candidateMoves'],'allRetainedValuesUnchanged':True,'removedFields':sorted(set(original)-{'candidateMoves','schemaVersion','status'})}
    for name, value in replacements.items():
        html,n=re.subn(r'const '+name+r' = .*;',lambda m:'const '+name+' = '+json.dumps(value,ensure_ascii=False,separators=(',',':'))+';',html)
        assert n==1
    return html,summaries
