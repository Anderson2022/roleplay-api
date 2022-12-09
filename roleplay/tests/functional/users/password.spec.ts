import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";
import supertest from "supertest";

const BASE_URL = `http://${process.env.Host}:${process.env.PORT}`;

test.group("Password", (group) => {
  test("it should send and email with forgot password instructions", async ({
    assert,
  }) => {
    const user = await UserFactory.create();

    Mail.trap((message) => {
      assert.deepEqual(message.to, [
        {
          address: user.email,
        },
      ]);
      assert.deepEqual(message.from, {
        address: "no-reply@roleplay.com",
      });
      assert.equal(message.subject, "Roleplay: Recuperação de senha");
      assert.equal(message.text,"Clique no link abaixo para redefinir a senha");
    });

    await supertest(BASE_URL)
      .post("/forgot-password")
      .send({
        email: user.email,
        resetPasswordUrl: "url",
      })
      .expect(204);
    Mail.restore()
    
  });

  group.setup(async () => {
    await Database.beginGlobalTransaction();
  });
  group.setup(async () => {
    await Database.rollbackGlobalTransaction();
  });
});
