GLOBAL.window = {};

require("../src/courier");

var Courier = window.Courier;

describe("Courier", function(){
  describe("#receive", function(){
    it("should be able to send to one box", function(){
      var courier = new Courier(),
          box = "create-item",
          opener = jasmine.createSpy("createBoxOpener");

      courier.receive(box, opener);

      expect(opener).not.toHaveBeenCalled();

      courier.send(box);
      expect(opener).toHaveBeenCalled();
    });

    it("should be able to send to multiple boxes", function(){
      var courier = new Courier(),
          createBox = "create-item",
          updateBox = "updated-item",
          createBoxOpener = jasmine.createSpy("createBoxOpener"),
          updateBoxOpener = jasmine.createSpy("updateBoxOpener");

      courier.receive(createBox, createBoxOpener);
      courier.receive(updateBox, updateBoxOpener);

      expect(createBoxOpener).not.toHaveBeenCalled();
      expect(updateBoxOpener).not.toHaveBeenCalled();

      courier.send(createBox);
      expect(createBoxOpener).toHaveBeenCalled();
      expect(updateBoxOpener).not.toHaveBeenCalled();

      courier.send(updateBox);
      expect(updateBoxOpener).toHaveBeenCalled();
    });

    it("should return a function to allow removing the receiver", function(){
      var courier = new Courier(),
          box = "missing-message",
          unsubscribe;

      unsubscribe = courier.receive(box, function(){});
      unsubscribe();

      expect(function(){
        courier.send(box, {});
      }).toThrow("Courier: No receiver registered for 'missing-message'");
    });

    it("while unsubscribing should maintain the other boxes intact", function(){
      var courier = new Courier(),
          newItemBox = "new-item",
          changeItemBox = "change-item",
          changeItemOpener = jasmine.createSpy("opener"),
          newItemUnsubscribe, changeItemUnsubscribe;

      newItemUnsubscribe = courier.receive(newItemBox, function(){});
      changeItemUnsubscribe = courier.receive(changeItemBox, changeItemOpener);

      newItemUnsubscribe();

      expect(function(){
        courier.send(newItemBox, {});
      }).toThrow("Courier: No receiver registered for 'new-item'");

      expect(changeItemOpener).not.toHaveBeenCalled();

      expect(function(){
        courier.send(changeItemBox, {});
      }).not.toThrow();

      expect(changeItemOpener).toHaveBeenCalled();
    });
  });

  describe("#send", function(){
    it("should throw if no $receiver is register", function(){
      var courier = new Courier();

      expect(function(){
        courier.send('new-item', {});
      }).toThrow("Courier: No receiver registered for 'new-item'");
    });

    it("a text message", function(){
      var courier = new Courier(),
          message = "some message",
          receiver = jasmine.createSpy("receiver");

      courier.receive("new-message", receiver);
      courier.send("new-message", message);

      expect(receiver).toHaveBeenCalledWith(message);
    });

    it("an object message", function(){
      var courier = new Courier(),
          message,
          receiver = jasmine.createSpy("receiver");

      message = {
        some: "super",
        deeply: {
          nested: "message"
        }
      };

      courier.receive("new-message", receiver)
      courier.send("new-message", message);

      expect(receiver).toHaveBeenCalledWith(message);
    });

    it("should be able to wildcard a sender", function(){
      var courier = new Courier(),
          newReceiver = jasmine.createSpy("newReceiver"),
          removedReceiver = jasmine.createSpy("addedReceiver");

      courier.receive("message:new:item", newReceiver);
      courier.receive("message:removed:item", removedReceiver);

      courier.send(/message:.*:item/, {});

      expect(newReceiver).toHaveBeenCalled();
      expect(removedReceiver).toHaveBeenCalled();
    });

    it("should be able to wildcard a receiver", function(){
      var courier = new Courier(),
          receiver = jasmine.createSpy("receiver");

      courier.receive(/message:.*:item/, receiver);

      courier.send("message:new:item", {});
      courier.send("message:updated:item", {});

      expect(receiver.calls.length).toEqual(2);
    });

    it("should not raise when throwOnMissing is false", function(){
      var courier = new Courier();

      expect(function(){
        courier.send("missing-message", {}, {throwOnMissing: false});
      }).not.toThrow();
    });

    it("should have a returned value", function(){
      var courier = new Courier(),
          receiver = jasmine.createSpy("grabActiveLink").andCallFake(function(data){
            return "this is an active " + data;
          }),
          resulter = jasmine.createSpy("resulter");

      courier.receive("grabActiveLink", receiver);

      courier.send("grabActiveLink", "link", resulter);

      expect(receiver).toHaveBeenCalled();
      expect(resulter.calls[0].args[0]).toEqual(["this is an active link"]);
    });

    it("should have a returned value even while sending options in", function(){
      var courier = new Courier(),
          receiver = jasmine.createSpy("grabLink").andCallFake(function(){
            return "this is a link";
          }),
          resulter = jasmine.createSpy("resulter");

      expect(function(){
        courier.send("grabLink", {}, {throwOnMissing: false}, resulter);
      }).not.toThrow();

      expect(resulter).not.toHaveBeenCalled();

      courier.receive("grabLink", receiver);

      courier.send("grabLink", {}, {throwOnMissing: true}, resulter);

      expect(receiver).toHaveBeenCalled();
      expect(resulter.calls[0].args[0]).toEqual(["this is a link"]);
    });

    it("should run only once when multiple receivers are triggered", function(){
      var courier = new Courier(),
          firstReceiver = jasmine.createSpy("firstReceiver").andCallFake(function(){
            return 1;
          }),
          secondReceiver = jasmine.createSpy("secondReceiver").andCallFake(function(){
            return 2;
          }),
          resulter = jasmine.createSpy("resulter");

      courier.receive("firstReceiver", firstReceiver);
      courier.receive("secondReceiver", secondReceiver);

      courier.send(/^.+Receiver$/, {}, resulter);

      expect(firstReceiver).toHaveBeenCalled();
      expect(secondReceiver).toHaveBeenCalled();
      expect(resulter.calls[0].args[0]).toEqual([1,2]);
    });
  });
});
