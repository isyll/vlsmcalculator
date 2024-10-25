import { publish } from 'gh-pages'

publish('dist', function (err) {
  if (err) {
    console.log('Error: ', err)
  }
}).then(() => {
  console.log('Deployed successfully')
})
