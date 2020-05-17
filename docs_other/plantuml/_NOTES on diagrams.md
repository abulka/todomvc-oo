NOTES on diagrams.txt
=====================

Regenerate by vscode plantuml command

The output goes into `out/docs_other` - using the same name as the `.puml` file.  If you have a title then that name will be used! 

> If you add a name after the `@startuml` directive then you can override the output name (which is confusing so I don't, unless I have a title which is throwing off the file based naming, in which case I have to).

The plantuml plugin should be configured to not create a subdir, otherwise there is too much nesting of dirs.

# The diagrams
## mvca-architecture-v2.puml

- defined here
- now on gituml https://www.gituml.com/viewz/181 
- used as main diagram in readme article `out/docs_other/plantuml/mvca-architecture-v2.svg`
- gituml version is copy and paste of this version, with diagram html containing this whole article added, so it looks great in view mode on gituml.

## mvca-architecture-v1-deprecated-gituml-136.puml 

- defined on gituml at https://www.gituml.com/editz/136, 
- copy made here by copy paste the refine uml plantuml markdown
- there are no refs to github seem to be there
- not used in article

## todomvc-oo-event-flow-gituml-134.puml 

- this is a copy of the one on gituml https://www.gituml.com/viewz/134
- copy made here by copy paste of:
    - the generated uml incl. the literate code mapping macros
    - the refine uml plantuml markdown
- there are refs to github files in the gituml version, which are captured because we copied the generated uml plantuml markdown
- diagram used in readme article, however I use the gituml generated svg which is copied into `out/copied-from-gituml`

# Late note

Due to an issue with github rendering embedded images inside svg, I copy and serve my svg via github.io rather than raw.githubusercontent.com, hence why I copy these into `docs` via the `cpdeploy` script.

```
out/docs_other/plantuml/mvca-architecture-v2.svg \
out/copied-from-gituml/todomvc-oo-event-flow-gituml-134.svg \
```

Note the second file doesn't need to be served from there, but there were some browser console warnings so I played it safe.
