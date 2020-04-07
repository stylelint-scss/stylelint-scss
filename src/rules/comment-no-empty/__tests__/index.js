import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "// comment",
      description: "Double slash comment"
    },
    {
      code: "//* comment",
      description: "Double slash comments with first character as asterix"
    },
    {
        code: "/* comment */",
        description: "Single line block comment"
    }    
  ],
  reject: [
    {
      code: `
      /**/
    `,
      description: "Empty block comment",
      message: messages.expected,
      line: 2
    },
    {
      code: `
        /* 
        */
    `,
      description: "Empty multline block comment",
      message: messages.expected,
      line: 2
    },
    {
        code: `
          /* 

          */
      `,
        description: "Empty multline block comment with an empty line",
        message: messages.expected,
        line: 2
      },
    {
        code: `
        //
      `,
        description: "Empty double slash comment",
        message: messages.expected,
        line: 2
      },  
      {
        code: `
        //     
      `,
        description: "Empty double slash comment with spaces",
        message: messages.expected,
        line: 2
      },        
      {
        code: `
        //\t
      `,
        description: "Empty double slash comment with tab",
        message: messages.expected,
        line: 2
      },  
    ]
});
