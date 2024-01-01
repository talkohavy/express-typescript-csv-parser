# [Panax] Home Assignment - A Transactions Csv Parser

Uploading & parsing a csv file filled with transactions using streams.

## 1. About the Project

### - A. Introduction

This project is built as a classic **monorepo** using pnpm workspaces.  
As a classic monorepo, the basic folder structure is that of applications and packages, where all applications (living under the `apps` folder) are runnable programmes that are isolated from one another, and all packages (living under the `packages` folder) are there merely to serve those applications.

I took an approach of another common best practice, which is to create a `clients` folder at the root project, which would serve as home for wrappers around clients like redis, mongo, nodemailer, mysql, kafka, etc. (any client to which you need to connect to).

In this project you will see:

- 1 app (backend)
- 1 client (postgres)
- 0 packages

The entire project is written in `TypeScript`.

### - B. The Backend Server Structure

For simplicity reasons, the server was created with a _monolithic architecture_. However, it follows a special pattern which would make it easy to turn it into _micro-services architecture_ in the future, should it need to.
The pattern is having 3 folders:

- Routes
- Services
- Repositories

This approach de-couples the route from the service, and the service from the database (i.e. the repository). A route merely calls a service's method and returns its result as the response, and the service method itself is where all the business logic lies. The service's method might also make requests to a remote database, and those requests are delegated to a _client wrapper_, which hides away the client's internal logic.

### - C. For your convenience

Since this project contains many lines of code, I split the project into 2 branches:

- `master`
- `panax`

The `master` branch holds the setup files, the files which are required for pretty much every server project. It also holds the `devDependencies` stuff, like _prettier_, _eslint_, etc.  
The `panax` branch contains the code logic needed for the completing the task. They _should_ get most of the focus.

That way instead of looking at dozens of files, you'll only have a small subset of files which contain only what's most important.

You can check the PR [here](https://github.com/talkohavy/express-typescript-csv-parser/pull/1).

(don't be scared about the amount of rows... 2600 of them are just the package-lock file)

<br/>

---

## 2. Getting Started

### - A. Clone the project

```bash
git clone git@github.com:talkohavy/express-typescript-csv-parser.git
```

### - B. Checkout from master to panax

```bash
git checkout panax
```

### - C. Installation

Run the install command _when on panax branch_ using [`pnpm`](https://pnpm.io/installation)!  
Since this is a monorepo inited by pnpm, it must be installed by it.

```bash
pnpm install
```

### - D. .env

Create a `.env` at the root of the project, and add the following line:

```bash
POSTGRES_CONNECTION_STRING=***THAT CONNECTION URL I SENT YOU***
```

### - E. Start the app

To run the app simply run:

```bash
pnpm run dev
```

And that's it! You should see a line in the terminal saying:

_server started on port 8000_

### - F. Upload the example csv

I'm using `postman`, but it should be the same no matter what API platform you're using. Anyway, the curl command is what really matters:

```bash
curl --location 'http://localhost:8000/upload-csv-file' \
--form '=@"path/to/testFile.csv"'
```

This should output you with:

```json
{
    "totalCount": 8,
    "successCount": 8,
    "failCount": 0,
    "failedTransactions": []
}
```

Now try uploading different versions of that csv file (an empty one, a long one, one with missing values, different data-types on some columns, ...), and check out the returned report.

<br/>

---

## 3. Explaining My Solution

To answer the requirements I used 2 main packages: `formidable` & `csv-parse`.

`formidable` is a Node module for parsing file uploads.  
`csv-parse` is a parser converting CSV text input.

I also used the built in `PassThrough` from `node:stream`, to create my own ReadStream WriteStream tool that's fit for piping.

When uploading a csv file, which contains _transactions_ to the server, formidable is the first link in the chain. It starts reading the file, and streams it chunk by chunk into the csv parser. This is a concept commonly known as piping. Then, the csv parser reads those chunks, converts them into a _transaction record lines_, and sends each _transaction record line_ forward as a chunk to the next link in the chain. This is where my custom **MyStream** comes into play. It takes that chunk which represent a transaction, transforms it into an object so that we could better manipulate and run validations on, and then makes a db request to persist that transaction to the _Transactions table_.

Running validations is where **Error Handling** takes place.  
Let's examine some of the assumptions I've made:

1. There would always be a Table Headers line in the first line of the csv file.
2. Since the nature of `piping` is what it is, a csv holding an empty `reference_number` will be considered as valid. I can't fail the entire request upon witnessing a `reference_number` that is _null_, since some transactions might have already been persisted.
3. In the case of a transaction row with a missing `reference_number`, the transaction would be considered as invalid, and saved in an array of `failedTransactions`, which would later be sent back as part of the response.
4. A derivative of the above: in the **Transactions Table**, the unique ID MUST be provided to make an INSERT! It cannot be auto-generated either by the server, nor can it be an auto-increment number generate by the SQL server.
5. The response will contain a report that includes how many transaction persisted successfully, how many transactions overall were there, and how many failed. For the failed transactions, I also want to known what were the row values.
6. `Upsert` behavior. As I inferred from the task, the requirement was to implement `Upsert` behavior, which means `INSERT` new transactions, and `UPDATE` an already existing transaction. Given that behavior, the `created_time` value stays as it was during creation (even upon an update), and the `updated_time` (and the rest of the values) gets updated upon an update.

I can say a lot more, but this is turning into a REALLYYYY long doc file, and it feels like I spent more time on this doc than on the _actual_ code 🙃 so let's talk more on Wednesday. Peace out ✌🏼
