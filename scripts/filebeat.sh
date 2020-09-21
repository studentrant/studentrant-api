#!/usr/bin/env bash

./filebeat modules enable elasticsearch
./filebeat modules enable logstash
./filebeat setup
./filebeat -e
