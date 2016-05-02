#!/bin/bash

cd ./.git/hooks

for f in ../../git_hooks/*
do
  ln -s -f "$f" .
done