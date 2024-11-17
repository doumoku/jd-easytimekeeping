INPUT_DIR=./src/
INPUT_FILES=$(INPUT_DIR)/*.mjs
# INPUT_FILES=$(INPUT_DIR)/timekeeper.mjs
PUBLIC_API_OPTIONS= build --access public --format md --shallow --markdown-toc-max-depth 3
OUTPUT_DIR=./documentation/

ALL_DOC_FILES=$(addprefix $(OUTPUT_DIR),$(addsuffix .md, $(basename $(notdir $(INPUT_FILES)))))

api: $(ALL_DOC_FILES) package.json

$(OUTPUT_DIR)%.md: $(INPUT_DIR)%.mjs
	@echo "$^ --> $@"
	documentation $(PUBLIC_API_OPTIONS) $^ > $@

.PHONY: clean
clean:
	@echo $(ALL_DOC_FILES)
	rm -f $(ALL_DOC_FILES)