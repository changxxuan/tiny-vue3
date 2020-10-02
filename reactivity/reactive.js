let targetMap = new WeakMap()
let effectStack = []

function reactive(target){
    if(typeof target !== 'object') return
    let observed = new Proxy(target, baseHandler)
    return observed
}

const baseHandler = {
    get(target, key, receiver){
        const result = Reflect.get(target, key, receiver)
        track(target, key)
        return typeof result === 'object'? reactive(result) : result
    },
    set(target, key, value, receiver){
        if(value !== target.key){
            const result = Reflect.set(target, key, value, receiver)
            trigger(target, key, value)
            return result
        }
    }
}

function effect(fn, options = {}){
    let e = createReactiveEffect(fn, options)
    if(!e.lazy){
        e()
    }
    return e
}

function createReactiveEffect(fn, options){
    let effect = function effect(...args){
        return run(effect, fn, args)
    }
    effect.lazy = options.lazy
    effect.computed = options.computed
    effect.deps = []
    return effect
}

function run(effect, fn, args){
    try{
        if(!effectStack.includes(effect)){
            effectStack.push(effect)
            return fn(...args)
        }
    }finally{
        effectStack.pop()
    }
}

function computed(fn){
    let runner = effect(fn, { lazy: true, computed: true})
    return {
        effcet: runner,
        get value(){
            return runner()
        }
    }
}

function track(target, key){
    let effect = effectStack[effectStack.length - 1]
    if(effect){
        let depMap = targetMap.get(target)
        if(!depMap){
            depMap = new Map()
            targetMap.set(target, depMap)
        }
        let dep = depMap.get(key)
        if(!dep){
            dep = new Set()
            depMap.set(key, dep)
        }
        // 双向存储
        if(!dep.has(effect)){
            dep.add(effect)
            effect.deps.push(dep)
        }
            
    }
}

function trigger(target, key, value){
    let depMap = targetMap.get(target)
    if(!depMap){
        return
    }
    let deps = depMap.get(key)
    if(deps){
        const effects = new Set(),
              computeds = new Set()
        deps.forEach((effect) => {
            if(effect.computed){
                computeds.add(effect)
            }else{
                effects.add(effect)
            }
        })
        effects.forEach(effect => effect())
        computeds.forEach(computed => computed())
    }
}