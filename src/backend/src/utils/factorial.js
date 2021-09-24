
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

const average = list => list.reduce((prev, curr) => prev + curr) / list.length;
const sum = list => list.reduce((prev, curr) => prev + curr)

module.exports = {
  validate(benchmarks) {
    if (benchmarks.length % 2 == 0){
        let concurrences = null
        let repetitions = null
        for (let i in benchmarks){
            if (!benchmarks[i].execution){
                return {result:false,message:`Benchmark ${benchmarks[i].name} don't have executions yet`}
            }
            if (!concurrences){
                concurrences = benchmarks[i].concurrences.list
            } else {
                if (concurrences.length !==2 ){
                    return {result:false,message:"Benchmarks should have only 2 concurrencies"}
                }
                if (!arrayEquals(concurrences, benchmarks[i].concurrences.list)){
                    return {result:false,message:"Benchmarks should have same concurrencies values"}
                }
            }
            if (!repetitions){
                repetitions = benchmarks[i].execution.results.raw.length
            } else {
                if (repetitions !== benchmarks[i].execution.results.raw.length){
                    return {result:false,message:"Benchmarks should have same repetition value"}
                }
            }
        }
    } else {
        return {result:false,message:"Benchmarks should be selected in pairs"}
    }
    return {result:true}
  },

  plan(benchmarks) {
    const levels = {
        provider: {
            factor:"Provider",
            low:benchmarks[0].provider_acronym,
            high:benchmarks[1].provider_acronym
        },
        concurrence: {
            factor:"Concurrence",
            low:benchmarks[0].concurrences.list[0],
            high:benchmarks[0].concurrences.list[1]
        },
    }
    
    const countExperiments = Math.pow(2, Object.keys(levels).length)
    const matrix = [
        [1,1,1,1],
        [1,-1,1,-1],
        [1,1,-1,-1],
        [1,-1,-1,1],
    ]
    const plan = {}
    
    Y = {}

    //Repetitions
    for (let i in benchmarks[0].execution.results.summary){
        Y[i] = {
                0:
                    {   
                        //Provider low + concurrence low
                        0:benchmarks[0].execution.results.summary[i].concurrences[levels.concurrence.low].avg,
                        //Provider low + concurrence high
                        1:benchmarks[0].execution.results.summary[i].concurrences[levels.concurrence.high].avg
                    },
            
                1:
                    {   
                        //Provider high + concurrence low
                        0:benchmarks[1].execution.results.summary[i].concurrences[levels.concurrence.low].avg,
                        //Provider high + concurrence high
                        1:benchmarks[1].execution.results.summary[i].concurrences[levels.concurrence.high].avg
                    }
        }
    }

    for (let index = 0; index < countExperiments; index++) {
        const Yline = {}
        for (let i in Y){
            let A = (matrix[index][1]>0) ? 1 : 0
            let B = (matrix[index][2]>0) ? 1 : 0
            Yline[i] = parseFloat(Y[i][A][B])
        }
        const line = {
            "test":index,
            "i":matrix[index][0],
            "a":matrix[index][1],
            "b":matrix[index][2],
            "ab":matrix[index][3],
            "y":Yline,
            "avgy":average(Object.values(Yline))
        }

        let errorSum = 0
        for (let i in Y){
            const A = (matrix[index][1]>0) ? 1 : 0
            const B = (matrix[index][2]>0) ? 1 : 0
            const y = parseFloat(Y[i][A][B])
            const error = Math.pow(line.avgy - y,2)
            errorSum += error
        }
        line.error = errorSum
        plan[index] = line
        plan[index].partialQi = line.i * line.avgy
        plan[index].partialQa = line.a * line.avgy
        plan[index].partialQb = line.b * line.avgy
        plan[index].partialQab = line.ab * line.avgy
    }

    let effects = {
        i:0,
        a:0,
        b:0,
        ab:0
    }

    for (let i in plan){
        effects.i += plan[i].partialQi
        effects.a += plan[i].partialQa
        effects.b += plan[i].partialQb
        effects.ab += plan[i].partialQab
    }
    
    effects.i = effects.i / countExperiments
    effects.a = effects.a / countExperiments
    effects.b = effects.b / countExperiments
    effects.ab = effects.ab / countExperiments
    
    let sse = 0
    for (let i in plan){
        sse += plan[i].error
    }

    const variations = {
        i:Math.pow(effects.i,2)*countExperiments*Object.keys(levels).length,
        a:Math.pow(effects.a,2)*countExperiments*Object.keys(levels).length,
        b:Math.pow(effects.b,2)*countExperiments*Object.keys(levels).length,
        ab:Math.pow(effects.ab,2)*countExperiments*Object.keys(levels).length,
    }

    const ssy = sum(Object.values(variations))+sse
    const sst = ssy - variations.i

    const fractions = {
        a:(variations.a/sst)*100,
        b:(variations.b/sst)*100,
        ab:(variations.ab/sst)*100,
        error:(sse/sst)*100,
    }

    return {
            levels:levels,
            matrix:plan,
            effects:effects,
            Y:Y,
            sse:sse,
            ssy:ssy, 
            sst:sst,
            variations:variations,
            fractions:fractions
        }
  },
};