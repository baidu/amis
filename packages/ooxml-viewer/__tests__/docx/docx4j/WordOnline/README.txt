A simple HelloWorld docx created in Word Online on 20181129:

<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
	<Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml" Id="rId3" />
	<Relationship Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml" Id="rId2" />
	<Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="/word/document22.xml" Id="rId1" />
</Relationships>

Note Target="/word/document22.xml"!!!
compare others which don't start with "/"

Compare Word 2016 (which is correct):

-<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">

	<Relationship Target="docProps/app.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Id="rId3"/>
	<Relationship Target="docProps/core.xml" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Id="rId2"/>
	<Relationship Target="word/document.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Id="rId1"/>

</Relationships>

[Content_Types].xml is consistent; there the partname starts with "/":

<Override PartName="/word/document22.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml" />

If you open the Word Online docx in Word 2016 then save it, it "normalises" the rel to Target="word/document.xml" 

docx4j should do the same (but currently leaves things as-is).  Tracking at https://github.com/plutext/docx4j/issues/332