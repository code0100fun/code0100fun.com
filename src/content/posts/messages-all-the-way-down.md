---
title: 'It’s messages all the way down'
description: 'A closer look at processes, mailboxes, and the beautifully simple idea behind the BEAM.'
date: 2026-09-13
tags: [Elixir]
example: true
art: beam
---

Elixir processes have their own state and communicate by sending messages. A message is data: an atom, a tuple, a map, or another Erlang term.

That simple model is worth looking at before introducing supervisors, behaviors, and the rest of OTP.

## A process with a mailbox

This module keeps a counter. The recursive call carries the next state; `receive` selects a matching message from the mailbox.

```elixir
defmodule Counter do
  def start(initial \\ 0) do
    spawn(fn -> loop(initial) end)
  end

  defp loop(value) do
    receive do
      :increment ->
        loop(value + 1)

      {:get, caller, reference} ->
        send(caller, {reference, value})
        loop(value)
    end
  end
end
```

There is no shared mutable variable. Each iteration receives a value and decides what the next value should be.

## Ask a question, match the answer

Use a fresh reference to correlate the reply with this request:

```elixir
counter = Counter.start()
send(counter, :increment)

reference = make_ref()
send(counter, {:get, self(), reference})

receive do
  {^reference, value} -> IO.inspect(value)
after
  1_000 -> IO.puts("No reply within one second")
end
```

The pinned `reference` ensures this receive only accepts the response to our request. A timeout ensures the caller does not wait forever.

This tiny example prints `1`: messages from the same sender to the same receiver preserve their order.

## What the toy version leaves out

This counter has no supervision or monitoring. Unmatched messages stay in its mailbox. If the process crashes, callers only learn indirectly through a timeout.

Those are real design problems, and they are exactly the kind of machinery OTP helps you manage. A `GenServer` provides a standard structure for the state loop and request/reply interaction. Supervisors provide restart strategies.

## A useful mental model

Think about a process as a small machine with a mailbox. Its protocol determines what other processes can ask it to do. Its state is an implementation detail.

That separation is useful even outside the BEAM. It makes a good question to ask of a module, service, or hardware component: what messages cross the boundary, and who owns the state?
