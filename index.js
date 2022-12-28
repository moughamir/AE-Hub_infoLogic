const express = require('express')
const app = express()
const request = require('request')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const SERVICE_PROVIDER = 'https://r-entreprise.tax.gov.ma'
const ENDPOINT = '/rechercheentreprise/result'
const requestUrl = `${SERVICE_PROVIDER}${ENDPOINT}`
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  "X-API-Key": "x-lab-omnizya",
}
const setFormValues = (ice, type = 'ICE') => {
  return `param['criteria']=${ice}&param['type']=${type}`
}

app.get('/:ice', (req, res) => {
  request({
    url: requestUrl,
    method: 'POST',
    headers: headers,
    body: setFormValues(req.params.ice)
  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const dom = new JSDOM(body);
      var mCrit = dom.window.document
      let NameLabel = mCrit.getElementsByName("param['raisonSocialeNP']")[0].textContent
      let Activity = mCrit.getElementsByName("param['activite']")[0].textContent
      let IceLabel = mCrit.getElementsByName("param['numIce']")[0].value
      let IfuLabel = mCrit.getElementsByName("param['ifu']")[0].value
      let RcLocal = mCrit.getElementsByName("param['libelleRc']")[0].value
      let RcLabel = mCrit.getElementsByName("param['numRc']")[0].value
      let BusinessLocal = mCrit.getElementsByName("param['adresseVille']")[0].textContent
      const data = {
        "name": NameLabel,
        "activity": Activity,
        "iceNumber": IceLabel,
        "ifuNumber": IfuLabel,
        "rcLocal": RcLocal,
        "rcNumber": RcLabel,
        "businessAddress": BusinessLocal
      }


      res.json({
        q: req.params,
        a: data
      })
    }
  }

  )
})
app.listen(1337)