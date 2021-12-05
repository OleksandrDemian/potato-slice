# 🥔 Potato slice
Potato slice is a babel plugin to simplify React code by removing boilerplate statements.

## ⛓ How it works
TODO

### 🚀 useState
The `useState` hook is used to create reactive value.
The creation consists in destructuring the return of `useState` hook into value and setter.
```jsx
import { useState } from "react";

function Example() {
    const [value, setValue] = useState(5);
    return (
        <button onClick={() => setValue(value++)}>{value}</button>
    );
}
```

The goal is to simplify the reactive value creation into a normal assignment:
```jsx
// useState import is not necessary

function Example() {
    let $value = 5;
    return (
        <button onClick={() => $value++}>{$value}</button>
    );
}
```
The differences are:
* no `import` statement required
* reactive properties are prefixed with `$` sign. This is needed to differentiate between reactive properties and eventual non-reactive properties.
* no need to use hook, assign value directly
* no need for setter: assign new value to the reactive property will trigger reactivity

#### Q&A
_Why let?_  
As you know, const indicates a non-mutable value. It is ok with react because you will use setter in order to mutate property, but here the reactive property is mutable, this is why `let`.

#### Caveats
You cannot export the setter from custom hook. For example:
```jsx
function useCustomHook() {
    let $value = 5;
    
    return {
        $value,
    }
}

function Example() {
    const { $value } = useCustomHook();
    return (
        <button onClick={() => $value++}>{$value}</button>
    );
}
```

The example above will throw an error `onClick`. Instead, you should expose a modify function from custom hook:
```jsx
function useCustomHook() {
    let $value = 5;
    
    return {
        $value,
        increase: () => $value ++,
    }
}

function Example() {
    const { $value, increase } = useCustomHook();
    return (
        <button onClick={increase}>{$value}</button>
    );
}
```

### 📝 useMemo
TODO

### useEffect
TODO

### useContext
TODO (not needed?)

### Other?
