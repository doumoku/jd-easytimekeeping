INPUT_DIR=./src/

# For now, I only want to document functions in timekeeper.mjs
# INPUT_FILES=$(wildcard $(INPUT_DIR)*.mjs)
INPUT_FILES=$(INPUT_DIR)timekeeper.mjs constants.mjs

PUBLIC_API_OPTIONS= build --access public --format md --shallow --markdown-toc-max-depth 3
OUTPUT_DIR=./documentation/
ALL_DOC_FILES=$(addprefix $(OUTPUT_DIR),$(addsuffix .md, $(basename $(notdir $(INPUT_FILES)))))

api: $(ALL_DOC_FILES)

echo:
	@echo $(INPUT_FILES)
	@echo
	@echo $(ALL_DOC_FILES)

lint:
	documentation lint $(INPUT_FILES)

$(OUTPUT_DIR)%.md: $(INPUT_DIR)%.mjs
	@echo "$^ --> $@"
	documentation $(PUBLIC_API_OPTIONS) $^ > $@

.PHONY: clean
clean:
	rm -f $(ALL_DOC_FILES)