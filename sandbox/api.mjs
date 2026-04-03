//    <script src='../jquery.js'></script>
//    <script src='../partial.js'></script>
//    <script src='./users.data.js'></script>
//    <script type='text/javascript'>
// import $ from '../jquery.js';
import _ from '../partial.js';
// import '../partial.js';  // partial.js는 _라는 이름으로 export default 되어 있기 때문에 이렇게 import 하면 _가 undefined가 됨. partial.js에서 export default _;로 바꿔야 함.
// import users from './users.data.js'; // 다수인 경우 {users1, users2} 이런식으로 import 해야 함. 
// import * as myConf from './myConfigure.js'; // 모두 import 하는 방법, myConf.users1, myConf.users2로 접근 가능.

// 모든 변수 선언은 밑에서 재정의 가능하도록 var 로(테스트 전용)
(() => {
    // console.log('_.partial(= _) : 커링 #################################################');
    var sub = (a, b) => a - b;
    // let sub10 = _.partial(sub, 10);
    var sub10 = _(sub, 10); // _ == _.partial
    console.log(sub10(7));    // 3

    var sub1 = _(sub, _, 10);
    console.log(sub1(7));   // -3
})
// ()
;

// console.log('___ : 가변인자 placeholder #################################################');
(() => {
    var pc = _(console.log, ___, 2, 3);
    pc(1);  //1 2 3
    pc(1, 4, 5, 6);    //1 4 5 6 2 3

    var pc2 = _(console.log, _, 2, ___, 6);
    pc2(1, 3, 4, 5); //1 2 3 4 5 6

    var pc3 = _(console.log, _, 2, ___, 5, _, 7);
    pc3(1); // 1 2 5 undefined 7
    pc3(1, 3, 4);    //1 2 3 5 4 7
    pc3(1, 3, 4, 6, 8);  //1 2 3 4 6 5 8 7
})
// ()
;

// console.log('_.pipe(= __) : 좌->우 함수 합성 #################################################');
(() => {
    var sum = (a, b) => a + b;
    var square = a => a * a;

    var f1 = __(sum, square, square); // sum -> square -> square
    var result = f1(1, 2);
    console.log(result); // 81
})
// ()
;

// console.log('_.go : 파이프라인 즉시 실행 버전, 첫인자로 데이터, 두번째 부터 함수 결과 리턴 #################################################');
(() => {
    _.go(10,
        a => a * 10,
        a => a - 50,
        a => a + 10,
        console.log // 60
    );
})
// ()
;


// console.log('_.mr : Multiple Results 다음 함수에게 2개 이상의 인자 전달 가능 #################################################');
(() => {
    _.go(10,
        a => _.mr(a * 10, 50),
        (a, b) => a - b,
        a => a + 10,
        console.log // 60
    );
    _.go(_.mr(2, 3),
        (a, b) => a + b,
        a => a * a,
        console.log // 25
    );
    _.go(_.to_mr([2, 3]),   // 배열을 값으로 받아 멀티 리턴 배열(mr) 만듦.
        (a, b) => a + b,
        console.log // 5
    );
})
// ()
;

// console.log('_.tap 받아둔 함수들 모두 실행 후 처음 받은 인자 리턴하는 파이프라인 함수 #################################################');
(() => {
    _.go(10,
        _.tap(
            a => a * a,
            console.log // 100
        ),
        console.log // 10
    )
})
// ()
;

// console.log('_.all : 같은 인자를 다수의 함수에 전달, 각 함수 리턴을 모아 다음 함수로 전달 #################################################');
(() => {
    _.go(10,
        _.all(
            a => a * a,
            a => a - 5,
            a => a + 5
        ),
        // (x, y, z) => [x, y, z],   // 100 5 15
        console.log // 100 5 15
    );
})
// ()
;

// console.log('_.spread : 다수 인자 순서대로 함수에 전달, 각 리턴을 다음 함수에 전달 #################################################');
(() => {
    _.go(_.mr(10, 20),
        _.spread(
            a => a * a,
            a => a * a
        ),
        console.log // 100 400
    );
})
// ()
;

// console.log('Collections #################################################');
// console.log('_.each(list, iteratee) : 리스트 끝까지 순회하여 함수 실행 #################################################');
(() => {
    _.each([1, 2, 3], console.log);
    _.each({ one: 1, two: 2, three: 3 }, console.log);
})
// ()
;

// console.log('_.map(list, iteratee) : 리스트 순회, 주어진 함수로 새 배열 생성 #################################################');
(() => {
    _.go(_.map([1, 2, 3], num => num * 3), console.log); // [3,6,9]
    _.go(_.map({ one: 1, two: 2, three: 3 }, num => num * 3), console.log); // [3,6,9]
    _.go(_.map([[1, 2], [3, 4]], _.first), console.log);    // [1,3]
    _.go(_.map([[1, 2], [3, 4]], _.last), console.log);    // [2,4]
})
// ()
;

// console.log('_.reduce(list, iteratee, [memo]) inject 혹은 foldl라고 불리는 이 함수는 '
// + '리스트를 순회하며 하나의 값을 추출합니다. memo는 옵션값이며 추출될 값의 초기값이 됩니다. #################################################');
(() => {
    _.go(_.reduce([1, 2, 3], (memo, num) => memo + num, 100), console.log); // 106

    // console.log('_.reduceRight(list, iteratee, [memo]) : _.reduce 반대 방향 #################################################');
    var list = [[0, 1], [2, 3], [4, 5]];

    var flat = _.reduce(list, (a, b) => a.concat(b), []);
    console.log(flat);  // [0,1,2,3,4,5]

    var flatR = _.reduceRight(list, (a, b) => a.concat(b), []);
    console.log(flatR);  // [4,5,2,3,0,1]
})
// ()
;

// console.log('_.find(list, predicate) : 리스트 내부 관찰 predicate 결과 참인 값들 배열 리턴 ##################################################');
(() => {
    _.go(_.find([1, 2, 3, 4, 5, 6], num => num % 2 == 0), console.log); // 2
    _.go(_.filter([1, 2, 3, 4, 5, 6], num => num % 2 == 0), console.log); // [2,4,6]
})
// ()
;

// console.log('_.where[list, properties] : 리스트 내부 값 관찰하여 프로퍼티를 포함하는 객체 배열 반환 #################################################');
(() => {
    var db = [{ a: 1, b: 2 }, { a: 5, b: 6 }, { a: 9, b: 0, c: 8 }];
    _.go(_.where(db, { a: 9, b: 0 }), console.log); // [{ a: 9, b: 0, c: 8 }]
    // console.log('_.findWhere[list, properties] : 리스트 내부 값 관찰하여 프로퍼티를 포함하는 첫번째 객체 배열 반환 #################################################');
    _.go(_.findWhere(db, { a: 9, b: 0 }), console.log); // [{ a: 9, b: 0, c: 8 }]
})
// ()
;

// console.log('_.reject(list, predicate) : 리스트 순회하여 predicate 거짓값 배열 리턴 #################################################');
(() => {
    _.go(_.reject([1, 2, 3, 4, 5, 6], num => num % 2 == 0), console.log); // [1,3,5]
})
// ()
;

// console.log('_.every(list, [predicate]) : 리스트의 모든 값이 첨인지 판별 #################################################');
(() => {
    _.go(_.every([2, 4, 5], num => num % 2 == 0), console.log); // false
})
// ()
;

// console.log('_.some(list, [predicate]) : 리스트 값 중 하나라도 참이 있다면 참 #################################################');
(() => {
    _.go(_.some([false, null, 0, undefined]), console.log); // false
})
// ()
;

// console.log('_.contains(list, value, [fromIndex]) : 리스트 값이 value를 포함한다면 참 #################################################');
(() => {
    _.go(_.contains([1, 2, 3, 'text'], 'text'), console.log);  //true
})
// ()
;

// console.log('_.invoke(list, methodName, *arguments) : 리스트의 각 값이 가지고 있는 메소드를 실행 #################################################');
(() => {
    _.go(_.invoke([[5, 1, 7], [3, 2, 1]], 'sort'), console.log) // [1,5,7], [1,2,3]
})
// ()
;

// console.log('_.pluck(list, methodName, *arguments) : 프로퍼티의 값만 추출 #################################################');
(() => {
    _.go(_.pluck([{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }], 'name'), console.log); // ['moe', 'larry', 'curly']
})
// ()
;

// console.log('_.max(list, [iteratee]) : 리스트 값 중 최대값/최소값 리턴 #################################################');
(() => {
    _.go(_.max([{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }], list => list.age), console.log);
    _.go(_.max([{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }], list => list.name), console.log);

    _.go(_.min([{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }], list => list.age), console.log);
})
// ()
;

// console.log('_.sortBy(list, iteratee) : 리스트 값들 정렬 #################################################');
(() => {
    _.go(_.sortBy([{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }], 'name'), console.table); // 
})
// ()
;

// console.log('_.groupBy(list, iteratee) : 리스트 값들을 iteratee를 통해 특정 집합으로 분류 #################################################');
(() => {
    _.go(_.groupBy([1.3, 2.1, 2.4], num => Math.floor(num)), console.table); //{1: [1.3], 2: [2.1, 2.4]}
    _.go(_.groupBy(['one', 'two', 'three'], 'length'), console.table); // {3: ['one', 'two'], 5: ['three']}
})
// ()
;

// console.log('_.indexBy(list, iteratee) : 특정 리스트의 값을 인덱스 값으로 반영한 객체 리턴(값이 유니크 할 때) #################################################');
(() => {
    _.go(_.indexBy([{ name: 'moe', age: 40 }, { name: 'larry', age: 50 }, { name: 'curly', age: 60 }], 'age'), console.table); // 
})
// ()
;

// console.log('_.countBy(list, iteratee) : 리스트의 값들을 iteratee를 통해 분류된 값의 개수 정리한 객체 반환 #################################################');
(() => {
    _.go(_.countBy([1, 2, 3, 4, 5], num => num % 2 == 0 ? 'even' : 'odd'), console.table);
})
// ()
;

// console.log('_.shuffle(list) : 리스트의 값의 순서를 섞은 사본 리턴 #################################################');
(() => {
    _.go(_.shuffle([1, 2, 3, 4, 5]), console.log);
})
// ()
;

// console.log('_.sample(list, [n]) : 임의의 샘플 리턴, n값은 샘플수 배열 리턴 #################################################');
(() => {
    _.go(_.sample([1, 2, 3, 4, 5]), console.log);
    _.go(_.sample([1, 2, 3, 4, 5], 2), console.log);
})
// ()
;

// console.log('_.toArray(list) : 리스트를 진짜 배열로 리턴, arguments 객체 변경시 유용 #################################################');
(() => {
    _.go(((...args) => _.toArray(args).slice(1))(1, 2, 3, 4), console.log); // [2,3,4]
    _.go((function () { return _.toArray(arguments).slice(1) })(1, 2, 3, 4), console.log); // [2,3,4]
})
// ()
;

// console.log('_.size(list) : 리스트 값의 개수 리턴 #################################################');
(() => {
    _.go(_.size({ one: 1, two: 2, three: 3, four: undefined, five: null, six: 1 }), console.log); // 6
    _.go(_.size([1, 2, 3, 4, 5]), console.log); // 5
})
// ()
;

// console.log('_.partition(list, predicate) : 하나의 배열을 predicate 만족/비만족 배열로 나눔 #################################################');
(() => {
    _.go(_.partition([0, 1, 2, 3, 4, 5, 6], n => n % 2 != 0), console.table); // [[1,3,5], [0,2,4,6]]
})  // 배열 길이는 무조건 2, 첫번째 배열은 predicate 참인 값들, 두번째 배열은 predicate 거짓인 값들로 구성됨.
// ()
;

// console.log('_.sum(list, iteratee) : 배열의 내부 값에 iteratee를 적용한 값들을 더함 #################################################');
(() => {
    _.go(_.sum([1, 2, 3], n => n * 10), console.log); // 60
    _.go(_.sum(['a', 'b', 'c'], c => c.toUpperCase()), console.log); // ABC
})
// ()
;

// console.log('Array #################################################');
// console.log('_.first(array, [n]) : 배열의 첫번째 원소 리턴, n으로 몇 개까지 정함 #################################################');
(() => {
    _.go(_.first([1, 2, 3]), console.log); // 1 : 인자 지정이 없으면 첫번째 원소 리턴
    _.go(_.first([1, 2, 3], 2), console.log); // [1, 2] : 인자를 지정하면 배열로 리턴
})
// ()
;

// console.log('_.last(array, [n]) : 배열의 마지막 원소 리턴, n으로 몇 개까지 정함 #################################################');
(() => {
    _.go(_.last([1, 2, 3]), console.log); // 3
    _.go(_.last([1, 2, 3], 1), console.log); // [3]
})
// ()
;

// console.log('_.initial(array, [n]) : 배열의 마지막 요소만 제외한 배열 리턴 #################################################');
(() => {
    _.go(_.initial([1, 2, 3, 4, 5]), console.log); // [1,2]
    _.go(_.initial([1, 2, 3, 4, 5], 4), console.log); // [1]
})
// ()
;

// console.log('_.rest(array, [n]) : 배열의 첫번째 요소만 제외한 배열 리턴 #################################################');
(() => {
    _.go(_.rest([1, 2, 3, 4, 5]), console.log); // [2,3,4,5]
    _.go(_.rest([1, 2, 3, 4, 5], 2), console.log); // [3,4,5]
})
// ()
;

// console.log('_.compact(array, [n]) : 배열의 모든 거짓 값을 제거한 사본 리턴 #################################################');
(() => {
    _.go(_.compact([0, 1, false, 3, '', 3, undefined, null]), console.log); // [1,3,3]
})
// ()
;

// console.log('_.flatten(array, [noDeep]) : 중첩 배열을 폄, noDeep=true 배열을 한단계만 풂 #################################################');
(() => {
    _.go(_.flatten([1, [2], [3, [[4]]], 1]), console.log);  //[1,2,3,4,1]
    _.go(_.flatten([1, [2], [3, [[4]]], 1]), _.uniq, console.log);  //[1,2,3,4] : 중복 제거
    _.go(_.flatten([1, [2], [3, [[4]]]], true), console.table);  //[1,2,3,[[4]]]
})
// ()
;

// console.log('_.without(array, *values) : values와 같은 값이 제거된 배열 사본 리턴 #################################################');
(() => {
    _.go(_.without([1, 2, 3, 0, 1, 3, 1], 0, 1), console.log); // [2,3,3]
})
// ()
;

// console.log('_.union(*arrays) : 합집합 배열 리턴 #################################################');
(() => {
    _.go(_.union([1, 2, 3], [101, 2, 1, 10], [2, 1]), console.log); // [1,2,3,101,10]
})
// ()
;

// console.log('_.intersection(*arrays) : 교집합 배열 리턴 #################################################');
(() => {
    _.go(_.intersection([1, 2, 3], [101, 2, 1, 10], [2, 1]), console.log); // [1,2]
})
// ()
;

// console.log('_.difference(array, *others) : 첫번째 배열과 비교하여 하나의 차집한 배열 리턴 #################################################');
(() => {
    _.go(_.difference([1, 2, 3, 4, 5], [5, 2, 10]), console.log); // [1,3,4]
})
// ()
;

// console.log('_.uniq(array, iteratee) : 중복 제거된 배열 리턴 #################################################');
(() => {
    _.go(_.uniq([1, 2, 3, 4, 5, 5, 2, 10]), console.log); // [1,2,3,4,5,10]
})
// ()
;

// console.log('_.zip(*arrays) : 배열들의 값 중 인덱스가 동일한 값끼리 묶은 다중 배열 리턴 #################################################');
(() => {
    _.go(_.zip(['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]), console.table); //[["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]
})
// ()
;

// console.log('_.unzip(*arrays) : <-> _.zip #################################################');
// _.go(_.unzip([["moe", 30, true], ["larry", 40, false], ["curly", 50, false]]), console.log); //['moe', 'larry', 'curly'], [30, 40, 50], [true, false, false]

// console.log('_.object(list, [values]) : 배열->객체 #################################################');
// _.go(_.object([['moe', 30], ['larry', 40], ['curly', 50]]), console.log); // {moe: 30, larry: 40, curly: 50}
// _.go(_.object(['moe', 'larry', 'curly'], [30, 30, 40]), console.log);   // {moe: 30, larry: 40, curly: 50}

// console.log('_.indexOf(array, value, [isSorted]) : 못찾으면 -1 #################################################');
// _.go(_.indexOf([1, 2, 2, 2, 3, 4], 2), console.log); // 3
// console.log('_.lastIndexOf(array, value, [isSorted]) : 못찾으면 -1 #################################################');
// _.go(_.lastIndexOf([1, 2, 2, 2, 3, 4], 2), console.log); // 3

// console.log('_.sortedIndex(list, value, [iteratee]) : 리스트를 탐색하며 value가 삽입되었을 때 리스트의 정렬된 상태를 유지할 수 있는 위치의 인덱스를 찾음 #################################################');
// _.go(_.sortedIndex([1, 2, 2, 2, 3, 4], 2), console.log); // 1
// //error: _.go(_.sortedIndex([{ name: 'moe', age: 40 }, { name: 'curly', age: 60 }], { name: 'larry', age: 50 }, (a, b) => a.age - b.age), console.log); // 1
// // var stooges = [{ name: 'moe', age: 40 }, { name: 'curly', age: 60 }];
// // error: _.go(_.sortedIndex(stooges, { name: 'larry', age: 50 }, 'age'), console.log);

// console.log('_.findIndex(array, predicate) : _.indexOf와 같은 일을 하지만 predicate가 참을 반환하는 값의 인덱스 리턴 #################################################');
// var isOdd = n => n % 2 != 0;
// _.go(_.findIndex([4, 6, 8, 12], isOdd), console.log);    // -1
// _.go(_.findIndex([4, 6, 7, 12], isOdd), console.log);    // 2

// console.log('_.findLastIndex(array, predicate) : _.lastIndexOf와 같은 일을 하지만 predicate가 참을 반환하는 값 역순 탐색하여 인덱스 리턴 #################################################');
// var users = [{ 'id': 1, 'name': 'Bob', 'last': 'Brown' },
// { 'id': 2, 'name': 'Ted', 'last': 'White' },
// { 'id': 3, 'name': 'Frank', 'last': 'James' },
// { 'id': 4, 'name': 'Ted', 'last': 'Jones' }];
// _.go(_.findLastIndex(users, user => user.name = 'Ted'), console.log); // 1

// console.log('_.range([start], stop, [step]) : 범위를 정해 정수로 구성된 배열 리턴 #################################################');
// _.go(_.range(3), console.log); // [0,1,2]
// _.go(_.range(1, 3), console.log); // [1,2]
// _.go(_.range(0, 11, 5), console.log); // [0,5,10]
// _.go(_.range(0, -11, -5), console.log); // [0,-5,-10]
// _.go(_.range(0), console.log); // []

// console.log('_.remove(list, value) : 값을 지움 #################################################');
// _.go(_.remove([0, 1, 3, 3, 5], 3), console.log); // [0,1,3,5] 첫번째 찾은 것만 지움

// console.log('_.removeByIndex(list, index) : 해당 index값을 지움 #################################################');
// var list = [0, 1, 2, 3, 4, 9];
// _.removeByIndex(list, 5);   // 원본 배열을 리턴하지 않음에 주의!!
// _.go(list, console.log); // [0,1,2,3,4]

// console.log('Object #################################################');
// console.log('_.keys(object) : 키 배열 리턴 #################################################');
// _.go(_.keys({ one: 1, two: 2, three: 3 }), console.log); // ['one','two','three']
// console.log('_.values(object) : 값 배열 리턴 #################################################');
// _.go(_.values({ one: 1, two: 2, three: 3 }), console.log); // [1,2,3]
// console.log('_.val(object) : 프로퍼티 해당 값 리턴 #################################################');
// _.go(_.val({ one: 1, two: 2, three: 3 }, 'one'), console.log); // 1
// console.log('_.mapObject(object, iteratee) : _.map(배열 생성)과 유사, {} 생성 #################################################');
// _.go(_.mapObject({ one: 1, two: 2, three: 3 }, (v, k) => v + 5), console.log); // { one: 6, two: 7, three: 8 }
// console.log('_.pairs(object) : [key, val] 형태의 다중 배열 리턴 #################################################');
// _.go(_.pairs({ one: 1, two: 2, three: 3 }), console.log); // [["one", 1], ["two", 2], ["three", 3]]
// console.log('_.invert(object) : 키/값 반대로, 이 때 모든 값은 유니크하고 문자열로 나타낼 수 있어야 함 #################################################');
// _.go(_.invert({ one: 1, two: 2, three: 3 }), console.log); // {1: 'one', 2: 'two', 3: 'three'}
// console.log('_.functions(object) : 객체의 메소드들 이름 정렬된 상태의 배열 리턴 #################################################');
// _.go(_.functions(_), console.log); // ["all", "any", "bind", "bindAll", "clone", "compact", "compose" ...
// console.log('_.findKey(object, predicate) : 객체를 위한 _.findIndex, predicate 참인 key 리턴 #################################################');
// _.go(_.findKey({ Moe: 'moses', Larry: 'Louis', Curly: 'Jerome' }, val => /uis$/.test(val)), console.log); // Larry
// console.log('_.extend(destination, *sources)) : 얕은 복사 #################################################');
// _.go(_.extend({ name: 'moe' }, { age: 50 }, { height: 180 }), console.log); // {name: 'moe', age: 50, height: 180}
// console.log('_.pick(object, *keys)) : 키가 일치하는 속성을 뽑은 새로운 객체 리턴 #################################################');
// _.go(_.pick({ name: 'moe', age: 50, userid: 'moel' }, 'name'), console.log);
// _.go(_.pick({ name: 'moe', age: 50, userid: 'moel' }, ['name', 'age']), console.log); // {name: 'moe', age: 50}
// _.go(_.pick({ name: 'moe', age: 50, userid: 'moel' }, (v, k, o) => _.isNumber(v)), console.log); // {age: 50}
// console.log('_.omit(object, *keys)) : 키가 일치하는 속성을 뺀 새로운 객체 리턴 #################################################');
// _.go(_.omit({ name: 'moe', age: 50, userid: 'moel' }, 'name'), console.log);
// _.go(_.omit({ name: 'moe', age: 50, userid: 'moel' }, ['name', 'age']), console.log);
// _.go(_.omit({ name: 'moe', age: 50, userid: 'moel' }, (v, k, o) => _.isNumber(v)), console.log);
// console.log('_.defaults(object, *defaults)) : undefined를 default값으로 채움 #################################################');
// _.go(_.defaults({ flavor: 'choco' }, { flavor: 'vanilla', sprinkles: 'lots' }), console.log); // {flavor: 'choco', sprinkles: 'lots'}
// console.log('_.clone(object) : 얕은 복사, 중첩 객체는 복제하지 않고 참조 #################################################');
// _.go(_.clone({ name: 'moe' }), console.log); // {name:'moe'}
// console.log('_.has(object, key) : 특정 키가 존재하는지 #################################################');
// _.go(_.has({ a: 1, b: 2, c: 3 }, 'b'), console.log); // true

// // ########### _.method
// console.log('_.method(method, [*arguments]) : 객체의 메소드를 실행할 함수 리턴, 메소드에게 전달한 arguments도 받음 #################################################');
// _.go($('body'),
//     _.method('find', '#main'),
//     _.first,
//     console.log
// );
// _.go(('hello partial.js'),
//     _.method('replace', 'partial', 'lodash'),
//     _.method('toUpperCase'),
//     console.log
// );
// _.go([1, 2, 3, 4, 5],
//     _.method('slice', 1, 4),
//     console.log
// );
// var nums = [1, 2, 3, 4, 5];
// _.go(nums,
//     _.method('pop'),
//     __(result => `제거 요소 : ${result}`, console.log),
//     (data) => Promise.resolve(data) // then 사용을 위해 강제 Promise 반환
// ).then(() => console.log('원본 배열 : ', nums)).catch(err => console.error(err));

// console.log('_.isEqual(object, other) : 두 객체의 값을 비교해서 같은지 확인 #################################################');
// var a = { name: 'moe', luckyNumbers: [1, 2, 3] };
// var b = { name: 'moe', luckyNumbers: [1, 2, 3] };
// var c = { name: 'moe', luckyNumbers: [4, 5, 6] };
// console.log(a == b);            // false
// console.log(_.isEqual(a, b));   // true
// console.log('_.isMatch(object, properties) : 두 객체의 값을 비교해서 같은지 확인 #################################################');
// console.log(_.isMatch(c, { name: 'moe' }));    // true
// console.log('_.isEmpty(object) : 객체가 비어 있는지 #################################################');
// console.log(_.isEmpty(a)); // false
// console.log(_.isEmpty({})); // true
// console.log('_.isElement(object) : 객체가 DOM 엘리먼트인지 #################################################');
// console.log(_.isElement($('body')[0])); // true
// console.log('_.isArray(object) : 객체가 배열인지 #################################################');
// (function () {
//     console.log(arguments);
//     console.log('arguments is array ? ', _.isArray(arguments));  // false
//     console.log('arguments is arrayLike ? ', _.isArrayLike(arguments));  // true
//     console.log(_.isArray(_.toArray(arguments)));   // true

//     // isXXX
//     console.log('arguments is object ? ', _.isObject(arguments)); // true
//     console.log('arguments is arguments ? ', _.isArguments(arguments)); // true
//     console.log('alert is function ? ', _.isFunction(alert)); // true
//     console.log('"str" is string ? ', _.isString('str')); // true
//     console.log('5 is number ? ', _.isNumber(5)); // true
//     console.log(new Date(), ' is date ? ', _.isDate(new Date())); // true
//     console.log('/mar/ is RegExp? ', _.isRegExp(/mar/)); // true
//     try {
//         throw new TypeError('Example');
//     } catch (err) {
//         console.log('isError ? ', _.isError(err));
//     }
// })(1, 2, 3);


// console.log('Function #################################################');
// console.log('_.memoize(function, [hashFunction]) : 함수 리턴 저장, 동일 인자시 저장 값 리턴 #################################################');
// var mult5 = _.memoize(a => a * 5);
// console.log(mult5(1));
// console.log(mult5(5));
// console.log(mult5(1));  // cached
// console.log('_.memoize2(function, [hashFunction]) : 불변적으로 값을 다룰 때 성능/관리 유용, 불변적으로 값을 다루기기만하면 캐시를 비우는 것도 자동으로 이루어 짐 ################################################');
// var evens = _.memoize2(function (list) {
//     console.log('함수 본체에 들어와서 loop 실행');
//     return _.filter(list, function (num) {
//         return num % 2 == 0;
//     })
// });
// var list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// console.log(evens(list));
// // 함수 본체에 들어와서 loop 실행
// // [2, 4, 6, 8, 10]
// console.log(evens(list));
// // [2, 4, 6, 8, 10] (캐시를 사용하여 loop를 돌지 않음)
// list = list.concat(11, 12); // _.memoize2는 불변적으로 값을 다룰 때 성능과 관리가 유용합니다.
// console.log(list);
// // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// console.log(evens(list));
// // 함수 본체에 들어와서 loop 실행
// // [2, 4, 6, 8, 10, 12]
// console.log(evens(list));
// // [2, 4, 6, 8, 10, 12] (캐시를 사용하여 loop를 돌지 않음)

// console.log('_.delay(function, wait, *arguments) : wait(밀리초) 이후 함수 호출 #################################################');
// _.delay(console.log, 500, '_.delay function executed');
// console.log('_.defer(function, *arguments) : setTimeout 0, 콜 스택이 다 비워진 후에 함수가 호출됨 #################################################');
// _.defer(console.log, 'deferred call');
// console.log('direct call');
// console.log('_.once(function) : 한 번만 호출가능 #################################################');
// var oneTime = _.once(() => '_.once(function) : only one time');
// console.log(oneTime());
// // console.log(oneTime()); // not works .. 여야 하는데 계속 실행되는데?

// console.log('_.throttle(function, wait, [options]) : 설명 참고 #################################################');
// /*
//     _.throttle(function, wait, [options])은 함수를 받아 새로운 함수 throttled를 리턴합니다. 
//     throttled는 처음 호출할때 바로 실행됩니다. 
//     그 이후의 지정된 시간 동안 반복된 호출은 한번만 실행됩니다. 
//     옵션값인 {leading: false}는 throttled가 처음 실행될 때 기본값과 같이 바로 실행 되는 것이 아니라, 
//     지정한 시간 후에 실행됩니다. 
//     {trailing: false}는 지정한 시간 전의 실행은 모두 무효가 됩니다. 
//     즉 throttled가 지정된 시간 전에 반복적으로 호출 되어도 
//     지정된 시간이 지나기 전까지의 호출은 다 무효가 됩니다. 
//     지정된 시간이 지난 후에 호출해야 실행됩니다. 
//     기본 옵션값은 {leading: true, trailing: true}입니다.
// */
// var throttled = _.throttle(() => console.log('_.throttle : ' + new Date(), 1000)); //, { leading: true, trailing: false }));
// // $(window).scroll(throttled);    // 원하는 동작 안하는 것 같음.

// console.log('_.debounce(function, wait, [immediate]) : 설명 참고 #################################################');
// /*
// _.debounce(function, wait, [immediate]) _.debounce는 함수를 받아 새로운 함수 debounced를 리턴합니다. 
// (1)debounced를 실행하면 지정된 시간이 지난 후 받아둔 함수를 실행합니다. 
// 만일 지정된 시간 전에 debounced가 다시 실행되면 함수 실행은 다시 지정된 시간 이후로 미뤄집니다. 
// [immediate]에 true를 넘기면 debounced의 첫 번째 실행은 무조건 실행하고, 
// 그 후 시간 안에 실행된 함수는 무시됩니다.
// */
// var debounced = _.debounce(() => console.log('_.debounced : ' + new Date(), 1000)); //, { leading: true, trailing: false }));
// // $(window).scroll(debounced); //원하는 동작 안하는 것 같음.

// console.log('_.bind(function, object, *arguments) : 함수와 그 함수의 객체(this)를 지정하여 함수를 만듭니다. 옵션으로 함수의 인자를 받을 수 있습니다. #################################################');
// var func = _.bind(function (hi) { return hi + ': ' + this.name }, { name: 'moe' }, 'hello');
// console.log(func());



// console.log('Utility #################################################');
// console.log('_.identity(value) : 받은 값을 그대로 리턴 #################################################');
// console.log('_.constant(value) : 받은 값을 리턴하는 함수를 리턴 #################################################');
// var stooge = { name: 'moe' };
// console.log(stooge === _.identity(stooge));// true
// console.log(stooge === _.c(stooge)());  // true
// console.log('_.noop(): ', _.noop());  // 항상 undefined 반환
// console.log('_.random(min, max) : min과 max 사이의 임의의 정수 반환 #################################################');
// console.log(_.random(10, 20));
// console.log('_.hi(value) : console.log로 value를 출력한 뒤 value 리턴 #################################################');
// // _.hi = _.identity;  // debug 용으로 hi 쓴 후 한방에 console.log를 없앨 때 이용하면 개꿀!
// _.go({ name: 'moe' },
//     _.hi,
//     console.table
// )


// console.log('JSON Selector #################################################');
// console.log('_.sel(object, selector) : 깊은 값 조회 쿼리 #################################################');
// /*
//     ()를 사용할 때 id로 비교하는 경우에는 #을 사용하는 방식이 성능이 가장 좋습니다. 
//     JSON Selector는 ()를 통해 find(predicate)를 작성할 수 있어 단순히 key들로 찾아가는 방법보다 유용합니다. 
//     JSON Selector의 ()는 함수이므로, id 비교외에 다른 조건도 얼마든지 만들 수 있습니다.
// */
// var users = [
//     {
//         id: 1,
//         name: 'BJ',
//         post_count: 3,
//         posts: [
//             { id: 1, body: '하이', comments: [{ id: 3, body: '코멘트3' }] },
//             { id: 2, body: '하이2', comments: [{ id: 1, body: '코멘트1' }, { id: 2, body: '코멘트2' }] },
//             { id: 4, body: '하이4', comments: [{ id: 4, body: '코멘트4' }, { id: 5, body: '코멘트5' }] }
//         ]
//     },
//     {
//         id: 2,
//         name: 'PJ',
//         post_count: 1,
//         posts: [
//             { id: 3, body: '하이3', comments: [] }
//         ]
//     }
// ];
// // key로만 찾기
// console.log(
//     _.sel(users, '0->name'), // BJ
//     _.sel(users, '1->name'), // PJ
//     _.sel(users, '0->post_count'), // 3
//     _.sel(users, '1->post_count'), // 1
//     _.sel(users, '0->posts->1->body') // 하이2
// );
// // 괄호로 내부적으로 find + predicate 실행하기
// console.log(
//     _.sel(users, '(u=>u.id==1)->name'), // BJ
//     _.sel(users, '(u=>u.id==1)->posts->(p=>p.id==4)->body') // 하이4
// );
// // 동일 코드를 아래처럼 더 짧게 표현할 수 있습니다.
// console.log(
//     _.sel(users, '($.id==1)->name'), // BJ
//     _.sel(users, '(#1)->posts->(#4)->body') // 하이4
// );
