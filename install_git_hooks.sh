#!/bin/bash

if [ -d ./.git/hooks ] && [ -d ./git_hooks ]
then
  cd ./.git/hooks

  for f in ../../git_hooks/*
  do
    ln -s -f "$f" .
  done
fi
