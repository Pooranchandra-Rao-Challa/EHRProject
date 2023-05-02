
module.exports =[
  {
    "/send_patient": {
      "target": "https://engine201.staging.drfirst.com",
      "secure": true,
      "changeOrigin":true,
      "logLevel":"debug",
      "pathRewrite":{
        "/send_patient": "/servlet/rcopia.servlet.EngineServlet/send_patient"
      }
    }
  }

]

