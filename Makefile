NAME = dogduck/zjm.gd.cn
VERSION = 0.0.1-alpha

EXTRA_BUILD_FLAGS?=

.PHONY: all build release clean clean_images explore

all: build

build:
	docker build $(EXTRA_BUILD_FLAGS) -t $(NAME):$(VERSION) --rm . --no-cache

clean:
	docker container rm -f junkminertest
	docker image rm -f $(NAME):$(VERSION)

explore:
	docker container rm -f junkminertest
	docker run -itd -p 8080:80 -p 8443:443 --name junkminertest --rm $(NAME):$(VERSION) /sbin/my_init
	docker exec -it junkminertest bash
