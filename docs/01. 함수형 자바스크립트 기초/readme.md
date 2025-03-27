# 일급 함수

자바스크립트에서의 함수는 일급 객체이자 일급 함수이다.

## 일급 객체

컴퓨터 프로그래밍 언어 디자인에서, 일급 객체(영어: first-class object)란 다른 객체들에 일반적으로 적용 가능한 연산을 모두 지원하는 객체를 가리킨다. 보통 함수에 인자로 넘기기, 수정하기, 변수에 대입하기와 같은 연산을 지원할 때 일급 객체라고 한다.

일급 객체란 값으로 평가되는 모든 것,

`const,  let , var` 과 같은 선언문이나 `for , if` 와 같은 제어문은 값으로 평가되지 않는다.

하지만 `1, '1', true, null, undefined, [], {}` 와 같은 값은 값으로 평가된다.

## 일급 함수

일급 함수는 일급 객체의 특성을 가진 함수로 런타임 중 선언이 가능하며, 익명 선언이 가능하고 익명 선언 함수도 함수나 메소드의 인자로 전달할 수 있다.

사실 이것은 함수가 일급 객체로 다뤄지는 자바스크립트에선 자명한 사실인게 함수 자체가 값이기에 익명 선언이 가능하고, 인자로 전달하거나 반환 하는 것이 가능하다.

```typescript title="값으로 평가 가능한 함수"
const f1 = () => {};
console.log(typeof f1); // function
```

```typescript title="함수를 인자로 전달"
const f2 = (f: () => void) => f();
f2(() => console.log("Hello, World!")); // Hello, World!
```

```typescript title="함수를 반환"
const add = (a: number) => (b: number) => a + b;
const add5 = add(5);
console.log(add5(2)); // 7
```

# 클로저

클로저란 자신이 생성될 때, **스코프에서 알 수 있었던 변수를 기억하는 함수** 를 의미한다.

```typescript title="클로저의 예시"
const outer = () => {
  let a = 1;

  const inner = (b: number) => a + b;
  return inner;
};

console.log(outer()(2)); // 3
```

여기서 `a` 란 변수는 `outer` 함수가 호출 될 때 생성된 변수로 함께 생성된 `inner` 함수가 `outer` 함수의 스코프에 접근하여 사용할 수 있다.

즉 `inner` 함수는 본인이 생성될 때의 스코프를 기억하고 본인이 생성된 스코프가 바라보는 변수를 사용할 수 있는 클로저이다.

본 설명에서 스코프에서 알 수 있었던 변수라고 표기한 것은 클로저가 바라보는 변수는 언제나 생성됐을 때와 다른 값을 가질 수 있는 `mutable` 한 값이기 때문이다.

```typescript title="클로저의 mutable 한 값"
const outer = () => {
  let a = 1;

  const inner = (b: number) => {
    a++; // 생성됐을 때의 변수를 변경
    return a + b;
  };
  return inner;
};

const foo = outer();
console.log(foo(1)); // 3
console.log(foo(1)); // 4
```

클로저는 함수가 호출된 컨텍스트와 가비지컬렉터의 동작을 이해하는데 중요한 개념이다.

자바스크립트의 가비지 컬렉터는 사용되지 않는 컨텍스트에 대해서 메모리 할당을 해제하는데, 클로저는 함수가 호출된 컨텍스트를 기억하고 있기 때문에 가비지 컬렉터가 메모리 할당을 해제하지 않는다.

> 이 때 모든 컨텍스트의 할당을 해제하는 것이 아니라 기억되고 있는 변수에 대해서만 할당을 해제하지 않는다.
> 만약 위 예시의 `outer` 함수에 변수가 100개가 선언되었더라도, `a` 란 변수만 기억하고 있는 `inner` 함수만 존재한다면 `a` 란 변수만 할당을 해제하지 않는다.

좀 더 엄밀히 말하면 클로저는 자신이 생성될 때의스코프에서, 자신이 실행될 때 사용 할 변수만 기억하고 유지시키는 함수라 볼 수 있다.

## 클로저의 활용

클로저란 결국 외부 스코프에 공유하고 싶지 않은 변수를 특정 컨텍스트 내부에서 선언하고

해당 컨텍스트를 구독하고 있는 함수를 반환하여, 변수를 은닉하고 특정 컨텍스트 내부에서만 사용할 수 있도록 하는 기법이다.

하지만 은닉 자체가 클로저의 사용 목적이 아니다.

클로저는 **이전 상황을 나중에 일어날 상황가 이어나가거나, 함수로 함수로 만들어 부분 적용을 할 때 사용된다.**

```typescript title="클로저를 이용한 부분 적용"
const bank = (money: number) => {
  const add = (coin: number) => {
    money += coin;
    return money;
  };

  return add;
};

const ATM1 = bank(1000);
ATM1(500); // 1500;
// 다른 로직들...
ATM1(200); // 1700;
```

위 예시에서 `ATM1` 이라는 함수는 `bank` 함수가 호출될 때 생성된 `money` 란 변수를 기억하고 있기 때문에 `bank` 함수가 호출될 때 생성된 `money` 란 변수를 계속해서 사용할 수 있다.

`money` 란 변수를 `bank` 함수가 호출 되는 시점의 컨텍스트 안으로 숨김으로서

다른 로직들이 `money` 란 변수에 접근하지 못하도록 하고, `ATM1` 이라는 함수를 통해서만 `money` 란 변수에 접근할 수 있도록 만들었다.

이로 인해 의도치않게 초기에 선언한 값이 변경되는 부수효과의 위험으로부터 안전하게 만들 수 있으며 부분 적용을 통해 함수를 재사용할 수 있게 만들 수 있다.

# 고차 함수

고차함수란 함수를 인자로 받거나 함수를 반환하는 함수를 의미한다.

함수를 인자로 받는다는 개념은 이미 `Array.prototype.map`, `Array.prototype.filter`, `Array.prototype.reduce` 와 같은 메소드들에서 자주 사용하면서 익숙한 개념이다.

```typescript title="Array.prototype 을 이용한 고차 함수"
const arr = [1, 2, 3, 4, 5];
const double = (n: number) => n * 2; // 함수로 인자로 받아 double 하는 함수
console.log(arr.map(double)); // [2, 4, 6, 8, 10]

// 물론 익명함수로도 가능하다.
console.log(arr.map((n: number) => n * 2)); // [2, 4, 6, 8, 10]
```

함수를 반환하는 고차 함수의 예시를 살펴보자

```typescript title="함수를 반환하는 고차 함수"
type Constant = <T>(a: T) => () => T;
export const constant: Constant = (a) => () => a;

const ten = constant(10);
console.log(ten()); // 10
console.log(ten()); // 10
console.log(ten()); // 10
```

해당 함수는 `constant` 라는 함수가 호출될 때 생성된 `a` 란 변수를 기억하고 있는 함수를 반환한다.

이번엔 함수를 인자로 받으며, 함수를 반환하는 고차 함수를 살펴보자

```typescript title="callWith"
type CallWith = <T>(
  value1: T
) => <R, U>(value2: R, fn: (val1: T, val2: R) => U) => U;

export const callWith: CallWith = (value1) => (value2, fn) =>
  fn(value1, value2);
```

`callWith` 함수는 `value1` 이라는 인자를 받아 `value2` 와 `fn` 이라는 함수를 인자로 받는 함수를 반환한다.

만약 10이란 숫자를 기억한채로 다양한 로직을 구현하고 싶다면 다음처럼 사용 가능하다.

```typescript title="함수를 반환한 후 함수를 인자로 받는 고차함수의 응용"
type Add = (a: number, b: number) => number;
export const add: Add = (a, b) => a + b;

const callWith10 = callWith(10);
const addResult = callWith10(20, add);
console.log(addResult); // 30

// 필요에 따라 할당할 필요 없이 즉시 호출하여 사용할 수 있다.
console.log(callWith(10)(20, add)); // 30
```

## callWith 응용

`callWith` 함수는 위에서 예시로 들었던 `constant` 메소드와 비슷하게 클로저를 통해 호출된 시점의 변수를 매번 기억한 후 인수로 받는 함수에게 기억해뒀던 변수를 건내주는 메소드이다.

이런 메소드는 하나의 데이터를 다양한 방식으로 가공하고 싶을 때 함께 사용 할 수 있다.

이런 시나리오를 생각해보자

```typescript title="예제 데이터"
const users = [
  {
    name: "John",
    isActive: true,
    age: 25,
  },
  {
    name: "Jane",
    isActive: false,
    age: 30,
  },
  {
    name: "Jim",
    isActive: true,
    age: 15,
  },
];
```

이런식의 데이터가 있을 때 나이가 몇 이상인 유저를 찾는다거나, 이름이 `John` 인 유저를 찾는다거나와 같은 경우를 말이다.

```tsx title="함수를 인수로 받는 filter , find 메소드 생성"
export const filter = <T,>(array: T[], predicate: (arg: T) => boolean) => {
  const result: T[] = [];

  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (predicate(element)) {
      result.push(element);
    }
  }

  return result;
};

export const find = <T,>(array: T[], predicate: (arg: T) => boolean) => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (predicate(element)) {
      return element;
    }
  }

  return null;
};
```

위와 같은 `filter` 와 `find` 메소드를 만들어서 사용하면 다음과 같이 사용할 수 있다.

```typescript title="filter 와 find 메소드 사용"
import * as _ from "./index";

const callWithUsers = _.callWith(users); // 데이터를 클로저 형태로 기억

const predicateOver20 = (user: User) => user.age > 20;
const predicateJohn = (user: User) => user.name === "John";

const over20 = callWithUsers(predicateOver20, _.filter);
const john = callWithUsers(predicateJohn, _.find);

// [
//  { name: 'John', isActive: true, age: 25 },
//  { name: 'Jane', isActive: false, age: 30 }
// ]
console.log(over20);
// { name: 'John', isActive: true, age: 25 }
console.log(john);
```

물론 교재에서도 이 과정이 효율적이지 않은 과정이란 것은 이야기 하지만 함수형 프로그래밍에서 함수를 응용하여 조합하여 사용하는 것을 연습하는데 좋은 예시라고 생각한다.

# 콜백 함수

> 📌 이 부분에 대해선 교재의 내용과 `MDN` 에서 소개하는 내용이 다르기에 나의 생각을 좀 버무려 정리하도록 한다.

`MDN` 에선 콜백함수를 다음과 같이 정의한다.

> 콜백 함수는 전달인자로 다른 함수에 전달되는 함수입니다. 이는 일종의 루틴이나 동작을 완료하기 위해 외부 함수 내부에서 호출됩니다.

즉, 콜백 함수는 소비자 (Consumer) 단에서 콜백 함수를 작성하고, API 공급자 (Provider , 혹은 caller) 에게 콜백 함수를 전달하여 소비자가 작성한 콜백 함수를 API 공급자가 호출하는 것을 말한다.

이런 콜백 함수는 콜백 함수를 전달하는 방식이 동기적 콜백 함수와 비동기적 콜백 함수로 나뉜다.

동기적 콜백 함수의 경우에는 `caller` 가 호출되는 시점에 콜백 함수가 호출되며 (`Array.prototype.forEach(callback)`)

비동기적 콜백 함수의 경우에는 `caller` 가 호출 된 후 비동기적으로 작업이 마무리 된 후 콜백함수가 호출된다. (`Promise.then(callback)`)

교재에선 동기적 콜백 함수의 경우 적합한 이름을 사용 할 것을 이야기 한다. 표현의 제약은 상상력에도 제약을 만들고, 적절하게 사용하지 못하게 하게 때문이다.

예를 들어 `forEach` 메소드에 들어가는 콜백 함수는 `iteratee` 라는 이름을 사용하는 것이 좋으며, `filter , find` 메소드에 들어가는 콜백 함수는 `predicate` 라는 이름을 사용하는 것이 좋다고 이야기 한다.

적합한 이름에서 적합한 인수와 반환값을 추론할 수 있기 때문이다.
