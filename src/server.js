// Welcome to the tutorial!
import {
  createServer,
  Model,
  hasMany,
  belongsTo,
  RestSerializer,
} from "miragejs";

export default function () {
  createServer({
    serializers: {
      reminder: RestSerializer.extend({
        include: ["list"],
        embed: true,
      }),
    },
    models: {
      list: Model.extend({
        reminders: hasMany(),
      }),
      reminder: Model.extend({
        list: belongsTo(),
      }),
    },

    seeds(server) {
      server.create("reminder", { text: "walk the dog" });
      server.create("reminder", { text: "walk the cat" });
      server.create("reminder", { text: "walk the majid" });

      //   reminders belongs to another list
      let homeList = server.create("list", { name: "Home" });
      server.create("reminder", { list: homeList, text: "do texes" });
      let workList = server.create("list", { name: "Work" });
      server.create("reminder", { list: workList, text: "visit bank" });
    },
    routes() {
      this.get("/api/lists/:id/reminders", (schema, request) => {
        let listId = request.params.id;
        let list = schema.lists.find(listId);
        return list.reminders;
      });
      this.get("/api/lists", (schema, request) => {
        return schema.lists.all();
      });
      this.get("/api/reminders", (schema) => {
        return schema.reminders.all();
      });
      //   let reminderLength = 1;
      this.post("/api/reminders", (schema, reuqest) => {
        let attrs = JSON.parse(reuqest.requestBody);
        console.log(attrs);
        return schema.reminders.create(attrs);
      });
      this.delete("/api/reminders/:id", (schema, request) => {
        let id = request.params.id;
        return schema.reminders.find(id).destroy();
      });
    },
  });
}
