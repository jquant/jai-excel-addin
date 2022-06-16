#!/bin/sh

awk 'BEGIN{RS="^$";ORS="";getline;gsub("\r","");print>ARGV[1]}' ./node_modules/office-addin-debugging/cli.js
awk 'BEGIN{RS="^$";ORS="";getline;gsub("\r","");print>ARGV[1]}' ./node_modules/office-addin-debugging/lib/cli.js
