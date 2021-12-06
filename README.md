# 🥔 Potato slice
Potato slice is a babel plugin to simplify React code by removing boilerplate statements, like calling to hooks (will be done automatically) or declaring hook dependencies (will be injected automatically).
The processing is at build time, so no performance impact on production code.

! IN THE CURRENT STATE THIS IS ONLY A PROOF-OF-CONCEPT AND SHOULD NOT BE USED.

## ⛓ How it works
This babel plugin will pre-process React code and replace the proposed syntax with standard React hooks.

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
The `useMemo` hook is used to create a memoized value, which will only be recalculated if one of the dependencies change.
The creation consist of passing factory function ot the hook and the list of dependencies.

```jsx
import { useMemo } from "react";

function Example({ value }) {
    const double = useMemo(() => value * 2, [value]);
    return (
        <span>{double}</span>
    );
}
```

Memoized property creation can be simplified by leaving properties injection to the transpiler and removing the call to useMemo.

```jsx
// useMemo import is not necessary

function Example({ $value }) {
    const $double = $value * 2;
    return (
        <span>{$double}</span>
    );
}
```

The differences are:
* no `import` statement required
* memo properties are prefixed with `$` sign. This is needed to differentiate between reactive properties and eventual non-reactive properties.
* no need to use hook, assign value directly
* no need to declare dependencies

#### Caveats
You cannot assign function to memo value. For example:
```jsx
function Example({ $value }) {
    const $double = () => {
        // do some things
        return $value * 2;
    }

    return (
        <span>{$double}</span>
    );
}
```

The example above will work as of now, but in the future I want to reserve that syntax for useCallback.
The goal is to create memo if the property is assigned to an operation (ex `$value * 2`) and callback if the value is function (see example above).

If you have to do some heavy calculation you can move it to a separate function, and then assign it to the memo value:
```jsx
function calculateDouble(value) {
    // do some things
    return value * 2;
}

function Example({ $value }) {
    const $double = calculateDouble($value);

    return (
        <span>{$double}</span>
    );
}
```
