# Jasmine Rails Editor
Editor using jasmine that allows javascript unit test
Inspired in [Try Jasmine](http://tryjasmine.com)


##Install

	bundle


##Usage
Run

	rails s

<hr>

	localhost:3000

If you want to test javascript code, write it in source section

Example
```javascript
panda = 'happy';

var Panda = {
  count_panditas: function() {
    return 2-1
  }
};


var Zoo = {
  open: function(hour) {
    if (hour>=4 && hour<=18){ 
      return true;
    }else{
      return false;
    }
  }
};
```

And the unit tests in ruby write it in specs section

Example
```ruby
describe('Describe the panda',function(){
  it('The panda should be happy',function(){
    expect(panda).toBe('happy');
  });
    it('The panda should has 3 panditas',function(){
      expect(Panda.count_panditas()).toBe(3);
  });
});

describe('Describe the Zoo',function(){
    it('The zoo should be closed at day',function(){
    hour = 9
    expect(Zoo.open(hour)).toBe(true);
  });
});
```
Press <b>Test Code!</b> and watch the results.
<br>

