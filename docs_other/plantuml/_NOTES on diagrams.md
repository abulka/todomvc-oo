NOTES on diagrams.txt
=====================

Regenerate by vscode plantuml command

The output goes into `out/docs_other` - using the same name as the `.puml` file.  If you add a name after the `@startuml` directive then you can override the output name (which is confusing so I don't).

The plantuml plugin should be configured to not create a subdir, otherwise there is too much nesting of dirs.

# The diagrams
## mvca-architecture-v2.puml

- defined here
- not on gituml
- used as main diagram in readme article `out/docs_other/plantuml/mvca-architecture-v2.svg`

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
