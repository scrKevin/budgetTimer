export default {
  
  methods: {
    formatDate(utcString) {
      if (typeof utcString !== "string") return null
      var date = new Date(Date.parse(utcString))
      date.setMinutes(
        date.getMinutes() - date.getTimezoneOffset()
      );
      return date.toISOString().slice(0, -8);
    }
  }
};