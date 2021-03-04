export default {
    months: [ 'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    customSort: function(items, index, isDesc) {
        items.sort((a, b) => {
            if (index[0]=='dateString') {
              if (!isDesc[0]) {
                return this.compareDateString(a, b, index)
              } else {
                return this.compareDateString(b, a, index)
              }
            }
            else if (index[0] === 'availableSpaces'){
              if (!isDesc[0]) {
                  return a[index] > b[index] ? 1 : -1;
                }
                else {
                    return b[index] > a[index] ? 1 : -1;
                }
            }
            else {
              if(typeof a[index] !== 'undefined'){
                if (!isDesc[0]) {
                  return a[index].toLowerCase().localeCompare(b[index].toLowerCase());
                }
                else {
                    return b[index].toLowerCase().localeCompare(a[index].toLowerCase());
                }
              }
            }
        });
        return items;
      },

      compareDateString(a, b, index) {
        var splittedDateStringA = a[index].split(' ')
        var splittedDateStringB = b[index].split(' ')
        var monthA = this.months.indexOf(splittedDateStringA[2])
        var monthB = this.months.indexOf(splittedDateStringB[2])
        if (monthA === monthB){
          if (parseInt(splittedDateStringA[1]) === parseInt(splittedDateStringB[1])) {
            return a.startTime.toLowerCase().localeCompare(b.startTime.toLowerCase()) 
          }
          else{
            return parseInt(splittedDateStringA[1]) > parseInt(splittedDateStringB[1]) ? 1 : -1;
          }
        }
        else{
          return monthA > monthB ? 1 : -1;
        }
      }
}