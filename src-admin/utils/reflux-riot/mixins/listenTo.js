export default function (Reflux) {

  const ListenerMethods = Reflux.ListenerMethods;

  Reflux.listenTo = function (listenable, callback, initial) {
    return {
      init: function () {
        this.on('mount', function () {
          for (const m in ListenerMethods) {
            if (this[m] !== ListenerMethods[m]) {
              if (this[m]) {
                throw `Can't have other property ${m}  when using Reflux.listenTo!`;
              }
              this[m] = ListenerMethods[m];
            }
          }
          this.listenTo(listenable, callback, initial);
        });
        this.on('unmount', ListenerMethods.stopListeningToAll)
      }
    }
  };

}
