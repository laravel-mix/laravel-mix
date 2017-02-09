class Test {

	constructor(bar) {
		this.bar = bar;
	}

	foo() {
		return this.bar;
	}
}

let test = new Test('it works');

console.log( test.foo() );
