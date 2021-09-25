const fs = require('fs')

export const readFile = () => {
  try {
    const data = fs.readFileSync('/Users/cangloa/Documents/FF-Ranks/SOS/sos-playoffs.csv', 'utf8')
    const lines: string[] = data.split('\n')
    lines.shift()
    const res = lines.reduce((acc, line) => {
      const columns = line.split(',')
      const team = columns[0]
      const bye = columns[1]
      const qb = parseInt(columns[2])
      const rb = parseInt(columns[3])
      const wr = parseInt(columns[4])
      const te = parseInt(columns[5])
      const k = parseInt(columns[6])
      const def = parseInt(columns[7])
      return {
        ...acc,
        [team]: {
          'QB': qb,
          'RB': rb,
          'WR': wr,
          'TE': te,
          'K': k,
          'DEF': def         
        }
      }
    }, {})

    console.log(JSON.stringify(res))
  } catch (err) {
    console.error(err)
  }
}
/**
{
  "PK": "SOS",
  "SK": "FULL",
  "ranks": {"ARI":{"qb":12,"rb":4,"wr":3,"te":2,"k":27,"def":25},"ATL":{"qb":6,"rb":8,"wr":5,"te":15,"k":24,"def":19},"BAL":{"qb":8,"rb":30,"wr":13,"te":31,"k":23,"def":16},"BUF":{"qb":7,"rb":6,"wr":22,"te":11,"k":12,"def":13},"CAR":{"qb":13,"rb":25,"wr":32,"te":24,"k":5,"def":31},"CHI":{"qb":10,"rb":24,"wr":11,"te":7,"k":26,"def":3},"CIN":{"qb":10,"rb":17,"wr":17,"te":29,"k":16,"def":26},"CLE":{"qb":13,"rb":28,"wr":8,"te":25,"k":31,"def":20},"DAL":{"qb":7,"rb":27,"wr":25,"te":28,"k":29,"def":14},"CEN":{"qb":11,"rb":10,"wr":6,"te":17,"k":7,"def":2},"DET":{"qb":9,"rb":2,"wr":26,"te":4,"k":20,"def":15},"GB":{"qb":13,"rb":21,"wr":18,"te":10,"k":15,"def":24},"HOU":{"qb":10,"rb":11,"wr":12,"te":22,"k":19,"def":1},"IND":{"qb":14,"rb":19,"wr":7,"te":21,"k":30,"def":11},"JAX":{"qb":7,"rb":9,"wr":2,"te":13,"k":6,"def":9},"KC":{"qb":12,"rb":26,"wr":20,"te":26,"k":21,"def":8},"LV":{"qb":8,"rb":15,"wr":27,"te":14,"k":22,"def":7},"LAC":{"qb":7,"rb":5,"wr":1,"te":23,"k":14,"def":5},"LAR":{"qb":11,"rb":22,"wr":14,"te":12,"k":25,"def":23},"MIA":{"qb":14,"rb":7,"wr":23,"te":6,"k":2,"def":12},"MIN":{"qb":7,"rb":32,"wr":24,"te":32,"k":18,"def":27},"NE":{"qb":14,"rb":14,"wr":9,"te":19,"k":10,"def":17},"NO":{"qb":6,"rb":20,"wr":29,"te":16,"k":17,"def":28},"NYG":{"qb":10,"rb":18,"wr":21,"te":5,"k":4,"def":10},"NYJ":{"qb":6,"rb":12,"wr":16,"te":9,"k":11,"def":22},"PHI":{"qb":14,"rb":31,"wr":30,"te":30,"k":28,"def":21},"PIT":{"qb":7,"rb":3,"wr":15,"te":8,"k":3,"def":32},"SF":{"qb":6,"rb":1,"wr":4,"te":1,"k":9,"def":18},"SEA":{"qb":9,"rb":23,"wr":10,"te":27,"k":8,"def":30},"TB":{"qb":9,"rb":13,"wr":28,"te":20,"k":1,"def":4},"TEN":{"qb":13,"rb":29,"wr":31,"te":18,"k":32,"def":29},"WAS":{"qb":9,"rb":16,"wr":19,"te":3,"k":13,"def":6}}}
*/