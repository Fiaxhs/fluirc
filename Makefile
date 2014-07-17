NW = /usr/bin/env nodewebkit
JSXC = /usr/bin/env jsxc
APP = /tmp/ouirc.nw

run:
	$(JSXC) src/ js/
	@rm -rf $(APP)
	mkdir $(APP)
	cp -r * $(APP)
	$(NW) $(APP)
