# Javascript client for Camomile REST API


## Usage

### HTML

```html
  <script type="text/javascript" src="fermata.js"></script>
  <script type="text/javascript" src="camomile.js"></script>
```

### Javascript

```javascript
  
  Camomile.setURL('http://camomile.fr/api')
  Camomile.login('username', 'password', callback);
  Camomile.logout(callback);

  Camomile.getCorpora(callback);
  Camomile.createCorpus(...);

```

### Server Sent Event

```javascript

    Camomile.listen(function(err, channel_id, eventSource) {
        var cancelWatcher = eventSource.watchCorpus(<corpus_id>, function(error, datas) {
            console.log(error, data);
        });
        
        // For unwatch Corpus :
        cancelWatcher();
    });
    
```

## Documentation

Will be available at http://camomile-project.github.io/camomile-server/ 
