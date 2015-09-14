// TEST_1
@Component({
  selector: 'app'
})
@View({
  template: `
    <h1>Test</h1>

    <p>
      Test
    </p>
  `,
  styles: [`
    .test {
      color: red;
    }
  `],
  directives: [CORE_DIRECTIVES]
})
export class App {}

// TEST_2
@Component({
  selector: 'app'
})
@View({
  template: `
    <h1>Test</h1>

    <p>
      Test
    </p>
  `,
  styles: [`
    .test {
      color: red;
    }
  `]
})
export class App {}

// TEST_3
@Component({
  selector: 'app'
})
@View({
  template: `
    <h1>Test</h1>

    <p>
      Test
    </p>
  `,
  styles: [`
    .test {
      color: red;
    }
    .common {
      color: grey;
    }
  `],
  directives: [CORE_DIRECTIVES]
})
export class App {}

// TEST_4
@Component({
  selector: 'app'
})
@View({
  template: `
    <h1>Test</h1>

    <p>
      Test
    </p>
  `,
  styles: [`
    .test {
      color: red;
    }
    .common {
      color: grey;
    }
    .test {
      color: red;
    }
    .common {
      color: grey;
    }
  `],
  directives: [CORE_DIRECTIVES]
})
export class App {}

// TEST_5
@Component({
  selector: 'app'
})
@View({
  template: `
    <h1>Test</h1>

    <p>
      Test
    </p>
  `,
  styles: [`
    .test {
      color: red;
    }
    .common {
      color: grey;
    }
  `],
  directives: [CORE_DIRECTIVES]
})
export class App {}

// TEST_6
@Component({
  selector: 'app'
})
@View({ template: `
  <h1>Test</h1>

  <p>
    Test
  </p>
`, styles: [`
  .test {
    color: red;
  }
  .common {
    color: grey;
  }
`] })
export class App {}

// TEST_7
@Component({
  selector: 'app'
})
@View({ template: `
  <h1>Test</h1>

  <p>
    Test
  </p>
`, styles: [`
  .test {
    color: red;
  }
  .common {
    color: grey;
  }
`], directives: [CORE_DIRECTIVES] })
export class App {}

// TEST_8
@Component({
  selector: 'app'
})
@View({ template: `
  <h1>Test</h1>

  <p>
    Test
  </p>
`,
  styles: [`
    .test {
      color: red;
    }
    .common {
      color: grey;
    }
  `], directives: [CORE_DIRECTIVES] })
export class App {}
